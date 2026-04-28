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
  Req,
} from '@nestjs/common';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { FindAllProfilesDto } from '../dto/find-all-profiles.dto';
import { ProfileService } from '../service/profile.service';
import { SessionGuard } from 'src/common/guards/session.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { RequirePermissions } from 'src/common/decorators/permissions.decorator';
import { Modules } from 'src/common/enums/module.enum';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('profiles')
@UseGuards(SessionGuard, PermissionsGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @RequirePermissions(Modules.Profiles, 'create')
  create(
    @Body() createProfileDto: CreateProfileDto,
    @CurrentUser('uuid') userUuid: string,
  ) {
    return this.profileService.create(userUuid, createProfileDto);
  }

  @Get()
  @RequirePermissions(Modules.Profiles, 'read')
  findAll(@Query() findAllProfilesDto: FindAllProfilesDto) {
    return this.profileService.findAll(findAllProfilesDto);
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
