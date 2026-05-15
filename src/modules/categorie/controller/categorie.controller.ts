import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategorieService } from '../services/categorie.service';
import { SessionGuard } from 'src/common/guards/session.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { RequirePermissions } from 'src/common/decorators/permissions.decorator';
import { Modules } from 'src/common/enums/module.enum';
import { CreateCategorieDto } from '../dto/create-categorie.dto';
import { UpdateCategorieDto } from '../dto/update-categorie.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Users } from 'src/modules/users/entities/user.entity';

import { BaseQueryDto } from 'src/common/dto/base-query.dto';

@Controller('categories')
@UseGuards(SessionGuard, PermissionsGuard)
export class CategorieController {
  constructor(private readonly categorieService: CategorieService) { }

  @Post()
  @RequirePermissions(Modules.Categories, 'create')
  create(
    @Body() createCategorieDto: CreateCategorieDto,
    @CurrentUser() user: Users
  ) {
    return this.categorieService.create(createCategorieDto, user);
  }

  @Get()
  @RequirePermissions(Modules.Categories, 'read')
  findAll(@Query() query: BaseQueryDto) {
    return this.categorieService.findAll(query);
  }

  @Get(':uuid')
  @RequirePermissions(Modules.Categories, 'read')
  findOne(@Param('uuid') uuid: string, @Query() query: BaseQueryDto) {
    return this.categorieService.findOneByUuid(uuid, query);
  }

  @Patch(':uuid')
  @RequirePermissions(Modules.Categories, 'update')
  update(
    @Param('uuid') uuid: string,
    @Body() updateCategorieDto: UpdateCategorieDto,
    @CurrentUser() user: Users
  ) {
    return this.categorieService.update(uuid, updateCategorieDto, user);
  }

  @Delete(':uuid')
  @RequirePermissions(Modules.Categories, 'delete')
  remove(@Param('uuid') uuid: string) {
    return this.categorieService.remove(uuid);
  }
}
