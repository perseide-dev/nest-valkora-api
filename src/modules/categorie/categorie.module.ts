import { CategorieController } from './controller/categorie.controller';
import { CategorieService } from './services/categorie.service';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categorie } from './entites/categorie.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Categorie]),
    forwardRef(() => AuthModule),
  ],
  controllers: [CategorieController,],
  providers: [CategorieService,],
  exports: [CategorieService, TypeOrmModule]
})
export class CategorieModule { }
