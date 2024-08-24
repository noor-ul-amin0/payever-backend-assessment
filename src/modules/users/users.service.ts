import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../schemas/user.schema';
import { ProducerService } from '../queues/producer.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Avatar } from '../schemas/avatar.schema';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { join } from 'path';

@Injectable()
export class UsersService {
  private readonly UPLOAD_DIR = join(process.cwd(), 'uploads');

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Avatar.name) private avatarModel: Model<Avatar>,
    private producerService: ProducerService,
    private httpService: HttpService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = await this.userModel.create(createUserDto);
    await this.producerService.addToEmailQueue(createdUser.email);
    return createdUser;
  }

  async getUserById(userId: string) {
    const { data } = await firstValueFrom(
      this.httpService.get(`/users/${userId}`),
    );

    return data.data;
  }

  async getAvatar(userId: string) {
    try {
      const avatarRecord = await this.avatarModel.findOne({ userId });
      if (avatarRecord) {
        const avatarPath = join(this.UPLOAD_DIR, avatarRecord.filePath);
        if (fs.existsSync(avatarPath)) {
          const imageData = fs.readFileSync(avatarPath);
          return imageData.toString('base64');
        }
      }

      const { data } = await firstValueFrom(
        this.httpService.get(`/users/${userId}`),
      );

      const avatarUrl = data.data.avatar;
      const response = await this.httpService.axiosRef({
        url: avatarUrl,
        method: 'GET',
        responseType: 'arraybuffer',
      });

      const avatarBuffer = Buffer.from(response.data, 'binary');
      const avatarHash = crypto
        .createHash('sha256')
        .update(avatarBuffer)
        .digest('hex');
      const filePath = `${avatarHash}.jpg`;

      // Ensure the uploads directory exists
      if (!fs.existsSync(this.UPLOAD_DIR)) {
        fs.mkdirSync(this.UPLOAD_DIR, { recursive: true });
      }
      fs.writeFileSync(join(this.UPLOAD_DIR, filePath), avatarBuffer);

      const newAvatar = new this.avatarModel({ userId, avatarHash, filePath });
      await newAvatar.save();

      return avatarBuffer.toString('base64');
    } catch (error) {
      console.error('Error fetching avatar:', error);
      throw new InternalServerErrorException('Error fetching avatar');
    }
  }

  async deleteAvatar(userId: string) {
    const avatarRecord = await this.avatarModel.findOne({ userId });
    if (!avatarRecord) throw new NotFoundException('Avatar not found');

    const avatarPath = join(this.UPLOAD_DIR, avatarRecord.filePath);
    if (fs.existsSync(avatarPath)) {
      fs.unlinkSync(avatarPath);
    }

    await this.avatarModel.deleteOne({ userId });
    return { message: 'Avatar deleted successfully.' };
  }
}
