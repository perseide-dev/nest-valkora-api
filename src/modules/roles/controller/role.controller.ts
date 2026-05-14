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
import { RoleService } from '../services/role.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { SessionGuard } from 'src/common/guards/session.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { RequirePermissions } from 'src/common/decorators/permissions.decorator';
import { Modules } from 'src/common/enums/module.enum';

@Controller('roles')
@UseGuards(SessionGuard, PermissionsGuard)
export class RoleController {
    constructor(private readonly roleService: RoleService) { }

    @Post()
    @RequirePermissions(Modules.Roles, 'create')
    create(@Body() createRoleDto: CreateRoleDto) {
        return this.roleService.create(createRoleDto);
    }

    @Get()
    @RequirePermissions(Modules.Roles, 'read')
    findAll() {
        return this.roleService.findAll();
    }

    @Get(':uuid')
    @RequirePermissions(Modules.Roles, 'read')
    findOne(@Param('uuid') uuid: string) {
        return this.roleService.findOneByUuid(uuid);
    }

    @Patch(':uuid')
    @RequirePermissions(Modules.Roles, 'update')
    update(@Param('uuid') uuid: string, @Body() updateRoleDto: UpdateRoleDto) {
        return this.roleService.update(uuid, updateRoleDto);
    }

    @Delete(':uuid')
    @RequirePermissions(Modules.Roles, 'delete')
    remove(@Param('uuid') uuid: string) {
        return this.roleService.remove(uuid);
    }
}
