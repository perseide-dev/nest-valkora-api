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
import { BaseQueryDto } from 'src/common/dto/base-query.dto';

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

  @Get(':uuid')
  @RequirePermissions(Modules.Profiles, 'read')
  findOne(@Param('uuid') uuid: string, @Query() query: BaseQueryDto) {
    return this.profileService.findOneByUuid(uuid, query);
  }

  @Patch(':uuid')
  @RequirePermissions(Modules.Profiles, 'update')
  update(@Param('uuid') uuid: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(uuid, updateProfileDto);
  }

  @Delete(':uuid')
  @RequirePermissions(Modules.Profiles, 'delete')
  remove(@Param('uuid') uuid: string) {
    return this.profileService.remove(uuid);
  }
}
