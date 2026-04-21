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

    @Get(':id')
    @RequirePermissions(Modules.Permissions, 'read')
    findOne(@Param('id') id: string) {
        return this.permissionService.findOne(+id);
    }

    @Patch(':id')
    @RequirePermissions(Modules.Permissions, 'update')
    update(@Param('id') id: string, @Body() updatePermissionDto: CreatePermissionDto) {
        return this.permissionService.update(+id, updatePermissionDto);
    }

    @Delete(':id')
    @RequirePermissions(Modules.Permissions, 'delete')
    remove(@Param('id') id: string) {
        return this.permissionService.remove(+id);
    }
}
