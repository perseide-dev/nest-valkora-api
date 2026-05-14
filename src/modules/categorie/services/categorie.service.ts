import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categorie } from '../entites/categorie.entity';
import { CreateCategorieDto } from '../dto/create-categorie.dto';
import { UpdateCategorieDto } from '../dto/update-categorie.dto';
import { Users } from 'src/modules/users/entities/user.entity';
import { BaseQueryDto } from 'src/common/dto/base-query.dto';
import { parseIncludes } from 'src/common/utils/typeorm-query.helper';
import { PaginatedResponse } from 'src/common/dto/pagination.dto';

@Injectable()
export class CategorieService {
  constructor(
    @InjectRepository(Categorie)
    private readonly categorieRepository: Repository<Categorie>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) { }

  async create(createCategorieDto: CreateCategorieDto, user: Users): Promise<Categorie> {
    const newCategorie = this.categorieRepository.create({
      ...createCategorieDto,
      createdBy: user,
      updatedBy: user,
    });
    return await this.categorieRepository.save(newCategorie);
  }

  async findAll(query: BaseQueryDto): Promise<PaginatedResponse<Categorie>> {
    const { page = 1, limit = 10, include } = query;
    const skip = (page - 1) * limit;
    const relations = parseIncludes(include);

    const [data, total] = await this.categorieRepository.findAndCount({
      skip,
      take: limit,
      relations: {
          ...relations,
          createdBy: relations.createdBy || true,
          updatedBy: relations.updatedBy || true,
      },
    });

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
        limit,
      },
    };
  }

  async findOneByUuid(uuid: string, query?: BaseQueryDto): Promise<Categorie> {
    const relations = parseIncludes(query?.include);
    const categorie = await this.categorieRepository.findOne({
      where: { uuid },
      relations: {
          ...relations,
          createdBy: relations.createdBy || true,
          updatedBy: relations.updatedBy || true,
      },
    });
    if (!categorie) throw new NotFoundException('Categoría no encontrada');
    return categorie;
  }

  async update(uuid: string, updateCategorieDto: UpdateCategorieDto, user: Users): Promise<Categorie> {
    const categorie = await this.findOneByUuid(uuid);
    Object.assign(categorie, updateCategorieDto);
    categorie.updatedBy = user;
    return await this.categorieRepository.save(categorie);
  }

  async remove(uuid: string): Promise<void> {
    const categorie = await this.findOneByUuid(uuid);
    await this.categorieRepository.remove(categorie);
  }
}
