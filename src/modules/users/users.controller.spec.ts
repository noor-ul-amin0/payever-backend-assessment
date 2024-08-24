import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUserService = {
    createUser: jest.fn(),
    getUserById: jest.fn(),
    getAvatar: jest.fn(),
    deleteAvatar: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto: CreateUserDto = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@example.com',
    };

    mockUserService.createUser.mockResolvedValue(createUserDto);

    expect(await controller.createUser(createUserDto)).toEqual(createUserDto);
    expect(service.createUser).toHaveBeenCalledWith(createUserDto);
  });

  it('should get a user by ID', async () => {
    const mockUser = { id: '1', first_name: 'John', last_name: 'Doe' };

    mockUserService.getUserById.mockResolvedValue(mockUser);

    expect(await controller.getUser('1')).toEqual(mockUser);
    expect(service.getUserById).toHaveBeenCalledWith('1');
  });

  it('should get a user avatar', async () => {
    const mockAvatar = 'base64-avatar-data';

    mockUserService.getAvatar.mockResolvedValue(mockAvatar);

    expect(await controller.getAvatar('1')).toEqual(mockAvatar);
    expect(service.getAvatar).toHaveBeenCalledWith('1');
  });

  it('should delete a user avatar', async () => {
    const mockResponse = { message: 'Avatar deleted successfully.' };

    mockUserService.deleteAvatar.mockResolvedValue(mockResponse);

    expect(await controller.deleteAvatar('1')).toEqual(mockResponse);
    expect(service.deleteAvatar).toHaveBeenCalledWith('1');
  });
});
