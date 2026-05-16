import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from './user.service';
import { Users } from '../entities/user.entity';
import { ControlGroup } from 'src/modules/control-groups/entities/control-group.entity';
import { Roles } from 'src/modules/roles/entities/roles.entity';
import { mockRepository } from 'src/common/utils/test.utils';
import * as randomNameUtil from 'src/common/utils/random-name.util';

jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: any;
  let rolesRepository: any;
  let controlGroupRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(ControlGroup),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Roles),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(Users));
    rolesRepository = module.get(getRepositoryToken(Roles));
    controlGroupRepository = module.get(getRepositoryToken(ControlGroup));
    
    jest.spyOn(randomNameUtil, 'generateRandomAccountName').mockReturnValue('RandomAnimal');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      email: 'test@test.com',
      userName: 'testuser',
      password: 'password123',
      rolUuid: 'role-uuid',
      controlGroupUuids: ['group-uuid'],
    };

    it('should throw ConflictException if user exists', async () => {
      userRepository.findOne.mockResolvedValue(new Users());
      await expect(service.create(createDto as any)).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException if role not found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      rolesRepository.findOneBy.mockResolvedValue(null);
      await expect(service.create(createDto as any)).rejects.toThrow(NotFoundException);
    });

    it('should create and save a new user', async () => {
      userRepository.findOne.mockResolvedValue(null);
      rolesRepository.findOneBy.mockResolvedValue({ id: 1 });
      controlGroupRepository.findBy.mockResolvedValue([{ id: 1 }]);
      
      const createdUser = { id: 1, email: 'test@test.com' };
      userRepository.create.mockReturnValue(createdUser);
      userRepository.save.mockResolvedValue(createdUser);

      const result = await service.create(createDto as any);
      
      expect(result).toEqual(createdUser);
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'salt');
      expect(randomNameUtil.generateRandomAccountName).toHaveBeenCalled();
      expect(userRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        email: 'test@test.com',
        userName: 'testuser',
        password: 'hashedPassword',
        rol: { id: 1 },
        controlGroups: [{ id: 1 }],
        accountName: 'RandomAnimal'
      }));
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const users = [{ id: 1 }];
      userRepository.findAndCount.mockResolvedValue([users, 1]);

      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result.data).toEqual(users);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
    });
  });

  describe('findOneByUuid', () => {
    it('should return user if found', async () => {
      const user = { uuid: 'test-uuid' };
      userRepository.findOne.mockResolvedValue(user);

      const result = await service.findOneByUuid('test-uuid');
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if not found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      await expect(service.findOneByUuid('test-uuid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and save user', async () => {
      const user = { uuid: 'test-uuid', password: 'old', rol: { id: 1 } };
      userRepository.findOne.mockResolvedValue(user);
      rolesRepository.findOneBy.mockResolvedValue({ id: 2 });
      userRepository.save.mockResolvedValue({ ...user, userName: 'new' });

      const updateDto = { userName: 'new', password: 'newpass', rolUuid: 'new-role' };
      
      const result = await service.update('test-uuid', updateDto as any);
      
      expect(bcrypt.hash).toHaveBeenCalledWith('newpass', 'salt');
      expect(user.password).toBe('hashedPassword');
      expect(user.rol.id).toBe(2);
      expect(userRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove user', async () => {
      const user = { uuid: 'test-uuid' };
      userRepository.findOne.mockResolvedValue(user);
      userRepository.remove.mockResolvedValue(user);

      await service.remove('test-uuid');
      expect(userRepository.remove).toHaveBeenCalledWith(user);
    });
  });
});
