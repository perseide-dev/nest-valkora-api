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

    @Get(':id')
    @RequirePermissions(Modules.Profiles, 'read')
    findOne(@Param('id') id: string) {
        return this.controlGroupService.findOne(+id);
    }

    @Patch(':id')
    @RequirePermissions(Modules.Profiles, 'update')
    update(@Param('id') id: string, @Body() updateControlGroupDto: CreateControlGroupDto) {
        return this.controlGroupService.update(+id, updateControlGroupDto);
    }

    @Delete(':id')
    @RequirePermissions(Modules.Profiles, 'delete')
    remove(@Param('id') id: string) {
        return this.controlGroupService.remove(+id);
    }
}
