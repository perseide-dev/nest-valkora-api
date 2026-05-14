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
import { PermissionService } from '../services/permission.service';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { SessionGuard } from 'src/common/guards/session.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { RequirePermissions } from 'src/common/decorators/permissions.decorator';
import { Modules } from 'src/common/enums/module.enum';

@Controller('permissions')
@UseGuards(SessionGuard, PermissionsGuard)
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) { }

    @Post()
    @RequirePermissions(Modules.Permissions, 'create')
    create(@Body() createPermissionDto: CreatePermissionDto) {
        return this.permissionService.create(createPermissionDto);
    }

    @Get()
    @RequirePermissions(Modules.Permissions, 'read')
    findAll() {
        return this.permissionService.findAll();
    }

    @Get(':uuid')
    @RequirePermissions(Modules.Permissions, 'read')
    findOne(@Param('uuid') uuid: string) {
        return this.permissionService.findOneByUuid(uuid);
    }

    @Patch(':uuid')
    @RequirePermissions(Modules.Permissions, 'update')
    update(@Param('uuid') uuid: string, @Body() updatePermissionDto: CreatePermissionDto) {
        return this.permissionService.update(uuid, updatePermissionDto);
    }

    @Delete(':uuid')
    @RequirePermissions(Modules.Permissions, 'delete')
    remove(@Param('uuid') uuid: string) {
        return this.permissionService.remove(uuid);
    }
}
