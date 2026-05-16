import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { Permissions } from '../entities/permissions.entity';
import { Roles } from '../../roles/entities/roles.entity';
import { ControlGroup } from '../../control-groups/entities/control-group.entity';
import { mockRepository } from 'src/common/utils/test.utils';

describe('PermissionService', () => {
  let service: PermissionService;
  let permissionRepository: any;
  let rolesRepository: any;
  let controlGroupRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionService,
        {
          provide: getRepositoryToken(Permissions),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Roles),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(ControlGroup),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<PermissionService>(PermissionService);
    permissionRepository = module.get(getRepositoryToken(Permissions));
    rolesRepository = module.get(getRepositoryToken(Roles));
    controlGroupRepository = module.get(getRepositoryToken(ControlGroup));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      permissionName: 'Test Permission',
      rolUuid: 'role-uuid',
      module: 'users' as any,
      focus: 'all' as any,
    };

    it('should throw NotFoundException if role not found', async () => {
      rolesRepository.findOneBy.mockResolvedValue(null);
      await expect(service.create(createDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if control group not found when provided', async () => {
      rolesRepository.findOneBy.mockResolvedValue({ id: 1 });
      controlGroupRepository.findOneBy.mockResolvedValue(null);
      await expect(service.create({ ...createDto, controlGroupUuid: 'group-uuid' })).rejects.toThrow(NotFoundException);
    });

    it('should create and save permission without control group', async () => {
      rolesRepository.findOneBy.mockResolvedValue({ id: 1 });
      
      const createdPermission = { id: 1, permissionName: 'Test Permission' };
      permissionRepository.create.mockReturnValue(createdPermission);
      permissionRepository.save.mockResolvedValue(createdPermission);

      const result = await service.create(createDto);

      expect(permissionRepository.create).toHaveBeenCalledWith({
        permissionName: 'Test Permission',
        module: 'users',
        focus: 'all',
        rol: { id: 1 },
        controlGroup: null,
      });
      expect(result).toEqual(createdPermission);
    });
  });

  describe('findAll', () => {
    it('should return all permissions', async () => {
      const permissions = [{ id: 1 }];
      permissionRepository.find.mockResolvedValue(permissions);

      const result = await service.findAll();
      expect(result).toEqual(permissions);
    });
  });

  describe('findOneByUuid', () => {
    it('should return permission if found', async () => {
      const permission = { uuid: 'perm-uuid' };
      permissionRepository.findOne.mockResolvedValue(permission);

      const result = await service.findOneByUuid('perm-uuid');
      expect(result).toEqual(permission);
    });

    it('should throw NotFoundException if not found', async () => {
      permissionRepository.findOne.mockResolvedValue(null);
      await expect(service.findOneByUuid('perm-uuid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update role and control group', async () => {
      const permission = { id: 1, uuid: 'perm-uuid', permissionName: 'Old' };
      permissionRepository.findOne.mockResolvedValue(permission);
      rolesRepository.findOneBy.mockResolvedValue({ id: 2 });
      controlGroupRepository.findOneBy.mockResolvedValue({ id: 3 });
      permissionRepository.save.mockResolvedValue({ ...permission, permissionName: 'New' });

      const updateDto = { permissionName: 'New', rolUuid: 'new-role', controlGroupUuid: 'new-group' } as any;
      const result = await service.update('perm-uuid', updateDto);

      expect(rolesRepository.findOneBy).toHaveBeenCalled();
      expect(controlGroupRepository.findOneBy).toHaveBeenCalled();
      expect(permissionRepository.save).toHaveBeenCalled();
    });

    it('should set control group to null if controlGroupUuid is explicitly null', async () => {
      const permission = { id: 1, uuid: 'perm-uuid', controlGroup: { id: 1 } };
      permissionRepository.findOne.mockResolvedValue(permission);
      permissionRepository.save.mockResolvedValue({ ...permission, controlGroup: null });

      await service.update('perm-uuid', { controlGroupUuid: null } as any);
      expect(permission.controlGroup).toBeNull();
      expect(permissionRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove permission', async () => {
      const permission = { uuid: 'perm-uuid' };
      permissionRepository.findOne.mockResolvedValue(permission);
      permissionRepository.remove.mockResolvedValue(permission);

      await service.remove('perm-uuid');
      expect(permissionRepository.remove).toHaveBeenCalledWith(permission);
    });
  });
});
