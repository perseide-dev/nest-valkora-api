import { Injectable } from '@nestjs/common';

@Injectable()
export class CategorieService {
  create(createCategorieDto: any) {
    return 'This action adds a new categorie';
  }

  findAll() {
    return `This action returns all categories`;
  }

  findOne(id: number) {
    return `This action returns a #id categorie`;
  }

  update(id: number, updateCategorieDto: any) {
    return `This action updates a #id categorie`;
  }

  remove(id: number) {
    return `This action removes a #id categorie`;
  }
}
