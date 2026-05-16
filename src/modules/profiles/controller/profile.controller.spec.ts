import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from '../service/profile.service';
import { SessionGuard } from 'src/common/guards/session.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { FindAllProfilesDto } from '../dto/find-all-profiles.dto';
import { BaseQueryDto } from 'src/common/dto/base-query.dto';

describe('ProfileController', () => {
  let controller: ProfileController;
  let service: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
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

    controller = module.get<ProfileController>(ProfileController);
    service = module.get<ProfileService>(ProfileService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with userUuid and dto', async () => {
      const dto: CreateProfileDto = { profileInfo: { name: 'Test', nationality: 'Test', race: 'Human' } } as any;
      const userUuid = 'user-uuid';
      const expectedResult = { id: 1, ...dto };
      
      jest.spyOn(service, 'create').mockResolvedValue(expectedResult as any);

      const result = await controller.create(dto, userUuid);
      
      expect(service.create).toHaveBeenCalledWith(userUuid, dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with query', async () => {
      const query: FindAllProfilesDto = { page: 1, limit: 10, search: 'test' };
      const expectedResult = { data: [], meta: { total: 0, page: 1, lastPage: 1, limit: 10 } };
      
      jest.spyOn(service, 'findAll').mockResolvedValue(expectedResult as any);

      const result = await controller.findAll(query);
      
      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should call service.findOneByUuid with uuid and query', async () => {
      const uuid = 'test-uuid';
      const query: BaseQueryDto = { include: 'lover' };
      const expectedResult = { id: 1, uuid };
      
      jest.spyOn(service, 'findOneByUuid').mockResolvedValue(expectedResult as any);

      const result = await controller.findOne(uuid, query);
      
      expect(service.findOneByUuid).toHaveBeenCalledWith(uuid, query);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should call service.update with uuid and dto', async () => {
      const uuid = 'test-uuid';
      const dto: UpdateProfileDto = { profileInfo: { name: 'new name' } };
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
