import {
  Body,
  Controller,
  Delete,
  Get,
  Query,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ProfileService } from '../service/profile.service';
import { SessionGuard } from 'src/common/guards/session.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { RequirePermissions } from 'src/common/decorators/permissions.decorator';
import { Modules } from 'src/common/enums/module.enum';

@Controller('profiles')
@UseGuards(SessionGuard, PermissionsGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @RequirePermissions(Modules.Profiles, 'create')
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }

  @Get()
  @RequirePermissions(Modules.Profiles, 'read')
  findAll(@Query() paginationDto: PaginationDto) {
    return this.profileService.findAll(paginationDto);
  }

  @Get(':id')
  @RequirePermissions(Modules.Profiles, 'read')
  findOne(@Param('id') id: string) {
    return this.profileService.findOne(+id);
  }

  @Patch(':id')
  @RequirePermissions(Modules.Profiles, 'update')
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(+id, updateProfileDto);
  }

  @Delete(':id')
  @RequirePermissions(Modules.Profiles, 'delete')
  remove(@Param('id') id: string) {
    return this.profileService.remove(+id);
  }
}
