import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permissions } from '../entities/permissions.entity';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { Roles } from '../../roles/entities/roles.entity';
import { ControlGroup } from '../../control-groups/entities/control-group.entity';

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(Permissions)
        private readonly permissionRepository: Repository<Permissions>,
        @InjectRepository(Roles)
        private readonly rolesRepository: Repository<Roles>,
        @InjectRepository(ControlGroup)
        private readonly controlGroupRepository: Repository<ControlGroup>,
    ) { }

    async create(createPermissionDto: CreatePermissionDto): Promise<Permissions> {
        const { rolUuid, controlGroupUuid, ...permissionData } = createPermissionDto;

        const role = await this.rolesRepository.findOneBy({ uuid: rolUuid });
        if (!role) throw new NotFoundException('Rol no encontrado');

        let controlGroup: ControlGroup | null = null;
        if (controlGroupUuid) {
            controlGroup = await this.controlGroupRepository.findOneBy({ uuid: controlGroupUuid });
            if (!controlGroup) throw new NotFoundException('Grupo de Control no encontrado');
        }

        const permission = this.permissionRepository.create({
            ...permissionData,
            rol: role,
            controlGroup,
        });
        return await this.permissionRepository.save(permission);
    }

    async findAll(): Promise<Permissions[]> {
        return await this.permissionRepository.find({ relations: ['rol', 'controlGroup'] });
    }

    async findOneByUuid(uuid: string): Promise<Permissions> {
        const permission = await this.permissionRepository.findOne({
            where: { uuid },
            relations: ['rol', 'controlGroup']
        });
        if (!permission) throw new NotFoundException('Permiso no encontrado');
        return permission;
    }

    async update(uuid: string, updatePermissionDto: CreatePermissionDto): Promise<Permissions> {
        const permission = await this.findOneByUuid(uuid);
        const { rolUuid, controlGroupUuid, ...permissionData } = updatePermissionDto;

        if (rolUuid) {
            const role = await this.rolesRepository.findOneBy({ uuid: rolUuid });
            if (!role) throw new NotFoundException('Rol no encontrado');
            permission.rol = role;
        }

        if (controlGroupUuid !== undefined) {
            if (controlGroupUuid === null) {
                permission.controlGroup = null;
            } else {
                const controlGroup = await this.controlGroupRepository.findOneBy({ uuid: controlGroupUuid });
                if (!controlGroup) throw new NotFoundException('Grupo de Control no encontrado');
                permission.controlGroup = controlGroup;
            }
        }

        Object.assign(permission, permissionData);

        return await this.permissionRepository.save(permission);
    }

    async remove(uuid: string): Promise<void> {
        const permission = await this.findOneByUuid(uuid);
        await this.permissionRepository.remove(permission);
    }
}
