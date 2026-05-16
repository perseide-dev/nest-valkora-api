import { Test, TestingModule } from '@nestjs/testing';
import { ControlGroupController } from './control-group.controller';
import { ControlGroupService } from '../services/control-group.service';
import { SessionGuard } from 'src/common/guards/session.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { CreateControlGroupDto } from '../dto/create-control-group.dto';

describe('ControlGroupController', () => {
  let controller: ControlGroupController;
  let service: ControlGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ControlGroupController],
      providers: [
        {
          provide: ControlGroupService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOneByUuid: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(SessionGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(PermissionsGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<ControlGroupController>(ControlGroupController);
    service = module.get<ControlGroupService>(ControlGroupService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with dto', async () => {
      const dto: CreateControlGroupDto = { groupName: 'Test' };
      const expectedResult = { id: 1, ...dto };
      
      jest.spyOn(service, 'create').mockResolvedValue(expectedResult as any);

      const result = await controller.create(dto);
      
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll', async () => {
      const expectedResult = [{ id: 1 }];
      
      jest.spyOn(service, 'findAll').mockResolvedValue(expectedResult as any);

      const result = await controller.findAll();
      
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should call service.findOneByUuid with uuid', async () => {
      const uuid = 'test-uuid';
      const expectedResult = { id: 1, uuid };
      
      jest.spyOn(service, 'findOneByUuid').mockResolvedValue(expectedResult as any);

      const result = await controller.findOne(uuid);
      
      expect(service.findOneByUuid).toHaveBeenCalledWith(uuid);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should call service.update with uuid and dto', async () => {
      const uuid = 'test-uuid';
      const dto: CreateControlGroupDto = { groupName: 'new' };
      const expectedResult = { id: 1, uuid, ...dto };
      
      jest.spyOn(service, 'update').mockResolvedValue(expectedResult as any);

      const result = await controller.update(uuid, dto);
      
      expect(service.update).toHaveBeenCalledWith(uuid, dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should call service.remove with uuid', async () => {
      const uuid = 'test-uuid';
      
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove(uuid);
      
      expect(service.remove).toHaveBeenCalledWith(uuid);
    });
  });
});
