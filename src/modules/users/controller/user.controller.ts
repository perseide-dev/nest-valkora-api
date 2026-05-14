import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { SessionGuard } from 'src/common/guards/session.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { RequirePermissions } from 'src/common/decorators/permissions.decorator';
import { Modules } from 'src/common/enums/module.enum';

@Controller('users')
@UseGuards(SessionGuard, PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @RequirePermissions(Modules.Users, 'create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @RequirePermissions(Modules.Users, 'read')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':uuid')
  @RequirePermissions(Modules.Users, 'read')
  findOne(@Param('uuid') uuid: string) {
    return this.usersService.findOneByUuid(uuid);
  }

  @Patch(':uuid')
  @RequirePermissions(Modules.Users, 'update')
  update(@Param('uuid') uuid: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(uuid, updateUserDto);
  }

  @Delete(':uuid')
  @RequirePermissions(Modules.Users, 'delete')
  remove(@Param('uuid') uuid: string) {
    return this.usersService.remove(uuid);
  }
}
