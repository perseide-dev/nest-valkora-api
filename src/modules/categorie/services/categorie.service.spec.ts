import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CategorieService } from './categorie.service';
import { Categorie } from '../entites/categorie.entity';
import { Users } from 'src/modules/users/entities/user.entity';
import { mockRepository } from 'src/common/utils/test.utils';

describe('CategorieService', () => {
  let service: CategorieService;
  let categorieRepository: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategorieService,
        {
          provide: getRepositoryToken(Categorie),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Users),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<CategorieService>(CategorieService);
    categorieRepository = module.get(getRepositoryToken(Categorie));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new categorie', async () => {
      const createDto = { categorieName: 'Test Category' };
      const user = { id: 1 } as Users;
      const createdCategorie = { id: 1, categorieName: 'Test Category', createdBy: user, updatedBy: user };

      categorieRepository.create.mockReturnValue(createdCategorie);
      categorieRepository.save.mockResolvedValue(createdCategorie);

      const result = await service.create(createDto as any, user);

      expect(categorieRepository.create).toHaveBeenCalledWith({
        ...createDto,
        createdBy: user,
        updatedBy: user,
      });
      expect(categorieRepository.save).toHaveBeenCalledWith(createdCategorie);
      expect(result).toEqual(createdCategorie);
    });
  });

  describe('findAll', () => {
    it('should return paginated categories', async () => {
      const categories = [{ id: 1 }];
      categorieRepository.findAndCount.mockResolvedValue([categories, 1]);

      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result.data).toEqual(categories);
      expect(result.meta.total).toBe(1);
    });
  });

  describe('findOneByUuid', () => {
    it('should return categorie if found', async () => {
      const categorie = { uuid: 'test-uuid' };
      categorieRepository.findOne.mockResolvedValue(categorie);

      const result = await service.findOneByUuid('test-uuid');
      expect(result).toEqual(categorie);
    });

    it('should throw NotFoundException if not found', async () => {
      categorieRepository.findOne.mockResolvedValue(null);
      await expect(service.findOneByUuid('test-uuid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and save categorie with updatedBy user', async () => {
      const categorie = { uuid: 'test-uuid', categorieName: 'Old' };
      const user = { id: 2 } as Users;
      categorieRepository.findOne.mockResolvedValue(categorie);
      categorieRepository.save.mockResolvedValue({ ...categorie, categorieName: 'New', updatedBy: user });

      const result = await service.update('test-uuid', { categorieName: 'New' } as any, user);
      
      expect(categorieRepository.save).toHaveBeenCalled();
      expect(result.categorieName).toBe('New');
      expect(result.updatedBy).toEqual(user);
    });
  });

  describe('remove', () => {
    it('should remove categorie', async () => {
      const categorie = { uuid: 'test-uuid' };
      categorieRepository.findOne.mockResolvedValue(categorie);
      categorieRepository.remove.mockResolvedValue(categorie);

      await service.remove('test-uuid');
      expect(categorieRepository.remove).toHaveBeenCalledWith(categorie);
    });
  });
});
