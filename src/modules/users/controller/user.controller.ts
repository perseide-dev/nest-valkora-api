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

  @Get(':id')
  @RequirePermissions(Modules.Users, 'read')
  findOne(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }

  @Patch(':id')
  @RequirePermissions(Modules.Users, 'update')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @RequirePermissions(Modules.Users, 'delete')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
