import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from '../schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from '../email/email.module';
import { QueueModule } from '../queues/queue.module';
import { HttpModule } from '@nestjs/axios';
import { Avatar, AvatarSchema } from '../schemas/avatar.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Avatar.name, schema: AvatarSchema },
    ]),
    HttpModule.register({
      baseURL: 'https://reqres.in/api',
    }),
    EmailModule,
    QueueModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
