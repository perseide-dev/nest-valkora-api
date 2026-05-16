import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ControlGroupService } from './control-group.service';
import { ControlGroup } from '../entities/control-group.entity';
import { mockRepository } from 'src/common/utils/test.utils';

describe('ControlGroupService', () => {
  let service: ControlGroupService;
  let controlGroupRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ControlGroupService,
        {
          provide: getRepositoryToken(ControlGroup),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<ControlGroupService>(ControlGroupService);
    controlGroupRepository = module.get(getRepositoryToken(ControlGroup));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new control group', async () => {
      const createDto = { groupName: 'Test Group' };
      const createdGroup = { id: 1, groupName: 'Test Group' };

      controlGroupRepository.create.mockReturnValue(createdGroup);
      controlGroupRepository.save.mockResolvedValue(createdGroup);

      const result = await service.create(createDto);

      expect(controlGroupRepository.create).toHaveBeenCalledWith(createDto);
      expect(controlGroupRepository.save).toHaveBeenCalledWith(createdGroup);
      expect(result).toEqual(createdGroup);
    });
  });

  describe('findAll', () => {
    it('should return an array of control groups', async () => {
      const groups = [{ id: 1 }];
      controlGroupRepository.find.mockResolvedValue(groups);

      const result = await service.findAll();
      expect(result).toEqual(groups);
      expect(controlGroupRepository.find).toHaveBeenCalledWith({ relations: ['users'] });
    });
  });

  describe('findOneByUuid', () => {
    it('should return control group if found', async () => {
      const group = { uuid: 'test-uuid' };
      controlGroupRepository.findOne.mockResolvedValue(group);

      const result = await service.findOneByUuid('test-uuid');
      expect(result).toEqual(group);
      expect(controlGroupRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: 'test-uuid' },
        relations: ['users']
      });
    });

    it('should throw NotFoundException if not found', async () => {
      controlGroupRepository.findOne.mockResolvedValue(null);
      await expect(service.findOneByUuid('test-uuid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and save control group', async () => {
      const group = { uuid: 'test-uuid', groupName: 'Old' };
      controlGroupRepository.findOne.mockResolvedValue(group);
      controlGroupRepository.save.mockResolvedValue({ ...group, groupName: 'New' });

      const result = await service.update('test-uuid', { groupName: 'New' });
      
      expect(controlGroupRepository.save).toHaveBeenCalled();
      expect(result.groupName).toBe('New');
    });
  });

  describe('remove', () => {
    it('should remove control group', async () => {
      const group = { uuid: 'test-uuid' };
      controlGroupRepository.findOne.mockResolvedValue(group);
      controlGroupRepository.remove.mockResolvedValue(group);

      await service.remove('test-uuid');
      expect(controlGroupRepository.remove).toHaveBeenCalledWith(group);
    });
  });
});
