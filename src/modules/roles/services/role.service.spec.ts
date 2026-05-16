import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { RoleService } from './role.service';
import { Roles } from '../entities/roles.entity';
import { Permissions } from '../../permissions/entities/permissions.entity';
import { mockRepository } from 'src/common/utils/test.utils';

describe('RoleService', () => {
  let service: RoleService;
  let roleRepository: any;
  let permissionRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: getRepositoryToken(Roles),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Permissions),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
    roleRepository = module.get(getRepositoryToken(Roles));
    permissionRepository = module.get(getRepositoryToken(Permissions));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new role with permissions', async () => {
      const createDto = {
        name: 'Admin',
        description: 'Administrator role',
        permissions: [{ module: 'users', create: true } as any],
      };

      const createdRole = { id: 1, name: 'Admin', permissions: [] };
      const createdPermission = { id: 1, module: 'users', create: true };

      roleRepository.create.mockReturnValue(createdRole);
      permissionRepository.create.mockReturnValue(createdPermission);
      roleRepository.save.mockResolvedValue({ ...createdRole, permissions: [createdPermission] });

      const result = await service.create(createDto);

      expect(roleRepository.create).toHaveBeenCalledWith({ name: 'Admin', description: 'Administrator role' });
      expect(permissionRepository.create).toHaveBeenCalledWith(createDto.permissions[0]);
      expect(roleRepository.save).toHaveBeenCalled();
      expect(result.permissions).toHaveLength(1);
    });

    it('should create and save a new role without permissions', async () => {
      const createDto = {
        name: 'User',
      };

      const createdRole = { id: 2, name: 'User' };

      roleRepository.create.mockReturnValue(createdRole);
      roleRepository.save.mockResolvedValue(createdRole);

      const result = await service.create(createDto as any);

      expect(roleRepository.create).toHaveBeenCalledWith(createDto);
      expect(permissionRepository.create).not.toHaveBeenCalled();
      expect(roleRepository.save).toHaveBeenCalled();
      expect(result).toEqual(createdRole);
    });
  });

  describe('findAll', () => {
    it('should return paginated roles', async () => {
      const roles = [{ id: 1 }];
      roleRepository.findAndCount.mockResolvedValue([roles, 1]);

      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result.data).toEqual(roles);
      expect(result.meta.total).toBe(1);
    });
  });

  describe('findOneByUuid', () => {
    it('should return role if found', async () => {
      const role = { uuid: 'role-uuid' };
      roleRepository.findOne.mockResolvedValue(role);

      const result = await service.findOneByUuid('role-uuid');
      expect(result).toEqual(role);
    });

    it('should throw NotFoundException if not found', async () => {
      roleRepository.findOne.mockResolvedValue(null);
      await expect(service.findOneByUuid('role-uuid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update role without permissions', async () => {
      const role = { id: 1, uuid: 'role-uuid', name: 'OldName' };
      roleRepository.findOne.mockResolvedValue(role);
      roleRepository.save.mockResolvedValue({ ...role, name: 'NewName' });

      const result = await service.update('role-uuid', { name: 'NewName' });
      
      expect(permissionRepository.delete).not.toHaveBeenCalled();
      expect(roleRepository.save).toHaveBeenCalled();
      expect(result.name).toBe('NewName');
    });

    it('should update role and replace permissions', async () => {
      const role = { id: 1, uuid: 'role-uuid', name: 'OldName', permissions: [] };
      roleRepository.findOne.mockResolvedValue(role);
      
      const newPermissions = [{ module: 'test', read: true } as any];
      permissionRepository.create.mockReturnValue({ module: 'test' });
      roleRepository.save.mockResolvedValue({ ...role, permissions: [{ module: 'test' }] });

      const result = await service.update('role-uuid', { permissions: newPermissions });
      
      expect(permissionRepository.delete).toHaveBeenCalledWith({ rol: { id: 1 } });
      expect(permissionRepository.create).toHaveBeenCalledWith(newPermissions[0]);
      expect(roleRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove role', async () => {
      const role = { uuid: 'role-uuid' };
      roleRepository.findOne.mockResolvedValue(role);
      roleRepository.remove.mockResolvedValue(role);

      await service.remove('role-uuid');
      expect(roleRepository.remove).toHaveBeenCalledWith(role);
    });
  });
});
