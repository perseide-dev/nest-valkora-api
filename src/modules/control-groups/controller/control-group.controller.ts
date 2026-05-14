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
import { ControlGroupService } from '../services/control-group.service';
import { CreateControlGroupDto } from '../dto/create-control-group.dto';
import { SessionGuard } from 'src/common/guards/session.guard';
import { PermissionsGuard } from 'src/common/guards/permissions.guard';
import { RequirePermissions } from 'src/common/decorators/permissions.decorator';
import { Modules } from 'src/common/enums/module.enum';

@Controller('control-groups')
@UseGuards(SessionGuard, PermissionsGuard)
export class ControlGroupController {
    constructor(private readonly controlGroupService: ControlGroupService) { }

    @Post()
    @RequirePermissions(Modules.Profiles, 'create') // Usamos Profiles o creamos un módulo nuevo en el enum si prefieres
    create(@Body() createControlGroupDto: CreateControlGroupDto) {
        return this.controlGroupService.create(createControlGroupDto);
    }

    @Get()
    @RequirePermissions(Modules.Profiles, 'read')
    findAll() {
        return this.controlGroupService.findAll();
    }

    @Get(':uuid')
    @RequirePermissions(Modules.Profiles, 'read')
    findOne(@Param('uuid') uuid: string) {
        return this.controlGroupService.findOneByUuid(uuid);
    }

    @Patch(':uuid')
    @RequirePermissions(Modules.Profiles, 'update')
    update(@Param('uuid') uuid: string, @Body() updateControlGroupDto: CreateControlGroupDto) {
        return this.controlGroupService.update(uuid, updateControlGroupDto);
    }

    @Delete(':uuid')
    @RequirePermissions(Modules.Profiles, 'delete')
    remove(@Param('uuid') uuid: string) {
        return this.controlGroupService.remove(uuid);
    }
}
