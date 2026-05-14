import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categorie } from '../entites/categorie.entity';
import { CreateCategorieDto } from '../dto/create-categorie.dto';
import { UpdateCategorieDto } from '../dto/update-categorie.dto';
import { Users } from 'src/modules/users/entities/user.entity';

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

  async findAll(): Promise<Categorie[]> {
    return await this.categorieRepository.find({
      relations: ['createdBy', 'updatedBy'],
    });
  }

  async findOneByUuid(uuid: string): Promise<Categorie> {
    const categorie = await this.categorieRepository.findOne({
      where: { uuid },
      relations: ['createdBy', 'updatedBy'],
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
