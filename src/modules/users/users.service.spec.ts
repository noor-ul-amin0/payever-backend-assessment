import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { ProducerService } from '../queues/producer.service';
import { HttpService } from '@nestjs/axios';
import { User } from '../schemas/user.schema';
import { Avatar } from '../schemas/avatar.schema';
import * as fs from 'fs';
import { of } from 'rxjs';
import { join } from 'path';

describe('UsersService', () => {
  let service: UsersService;
  let userModel;
  let avatarModel;
  let producerService;
  let httpService;

  beforeEach(async () => {
    const mockUserModel = {
      create: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const mockAvatarModel = {
      findOne: jest.fn(),
      deleteOne: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: getModelToken(Avatar.name),
          useValue: mockAvatarModel,
        },
        {
          provide: ProducerService,
          useValue: { addToEmailQueue: jest.fn() },
        },
        {
          provide: HttpService,
          useValue: { get: jest.fn(), axiosRef: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get(getModelToken(User.name));
    avatarModel = module.get(getModelToken(Avatar.name));
    producerService = module.get<ProducerService>(ProducerService);
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Clean up mocks between tests
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@example.com',
    };

    const savedUser = { ...createUserDto, _id: '1' };

    userModel.create.mockResolvedValue(savedUser);
    producerService.addToEmailQueue.mockResolvedValue(null);
    const result = await service.createUser(createUserDto);
    expect(result).toEqual(savedUser);
    expect(producerService.addToEmailQueue).toHaveBeenCalledWith(
      savedUser.email,
    );
  });

  it('should get a user by ID', async () => {
    const mockUser = { id: '1', first_name: 'John', last_name: 'Doe' };

    httpService.get.mockReturnValue(of({ data: { data: mockUser } }));

    const result = await service.getUserById('1');
    expect(result).toEqual(mockUser);
  });

  it('should get a user avatar from file', async () => {
    const mockAvatar = 'avatar-data';
    const avatarRecord = { filePath: 'avatar-path' };

    // Mocking database responses
    avatarModel.findOne.mockResolvedValue(avatarRecord);

    // Mocking filesystem interactions
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest
      .spyOn(fs, 'readFileSync')
      .mockReturnValue(Buffer.from(mockAvatar, 'utf-8'));

    const result = await service.getAvatar('1');
    expect(result).toBe(Buffer.from(mockAvatar).toString('base64'));
  });

  it('should delete a user avatar', async () => {
    const avatarRecord = { filePath: 'avatar-path' };

    // Mocking database and filesystem interactions
    avatarModel.findOne.mockResolvedValue(avatarRecord);
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'unlinkSync').mockImplementation(() => {}); // No return value for unlinkSync
    avatarModel.deleteOne.mockResolvedValue(null);

    const result = await service.deleteAvatar('1');
    const expectedPath = join(process.cwd(), 'uploads', 'avatar-path');
    expect(result).toEqual({ message: 'Avatar deleted successfully.' });
    expect(fs.unlinkSync).toHaveBeenCalledWith(expectedPath);
  });
});
