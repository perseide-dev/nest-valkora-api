import { Test, TestingModule } from '@nestjs/testing';
import { CategorieController } from './categorie.controller';
import { CategorieService } from '../services/categorie.service';
import { SessionGuard } from 'src/common/guards/session.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { CreateCategorieDto } from '../dto/create-categorie.dto';
import { UpdateCategorieDto } from '../dto/update-categorie.dto';
import { BaseQueryDto } from 'src/common/dto/base-query.dto';

describe('CategorieController', () => {
  let controller: CategorieController;
  let service: CategorieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategorieController],
      providers: [
        {
          provide: CategorieService,
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

    controller = module.get<CategorieController>(CategorieController);
    service = module.get<CategorieService>(CategorieService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with dto and user', async () => {
      const dto: CreateCategorieDto = { categorieName: 'Test' };
      const user = { id: 1 } as any;
      const expectedResult = { id: 1, ...dto };
      
      jest.spyOn(service, 'create').mockResolvedValue(expectedResult as any);

      const result = await controller.create(dto, user);
      
      expect(service.create).toHaveBeenCalledWith(dto, user);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with query', async () => {
      const query: BaseQueryDto = { page: 1, limit: 10 };
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
      const query: BaseQueryDto = { include: 'createdBy' };
      const expectedResult = { id: 1, uuid };
      
      jest.spyOn(service, 'findOneByUuid').mockResolvedValue(expectedResult as any);

      const result = await controller.findOne(uuid, query);
      
      expect(service.findOneByUuid).toHaveBeenCalledWith(uuid, query);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should call service.update with uuid, dto and user', async () => {
      const uuid = 'test-uuid';
      const dto: UpdateCategorieDto = { categorieName: 'new' };
      const user = { id: 1 } as any;
      const expectedResult = { id: 1, uuid, ...dto };
      
      jest.spyOn(service, 'update').mockResolvedValue(expectedResult as any);

      const result = await controller.update(uuid, dto, user);
      
      expect(service.update).toHaveBeenCalledWith(uuid, dto, user);
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
