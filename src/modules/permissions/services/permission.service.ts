import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permissions } from '../entities/permissions.entity';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { Roles } from '../../roles/entities/roles.entity';

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(Permissions)
        private readonly permissionRepository: Repository<Permissions>,
        @InjectRepository(Roles)
        private readonly rolesRepository: Repository<Roles>,
    ) { }

    async create(createPermissionDto: CreatePermissionDto): Promise<Permissions> {
        const { rolUuid, ...permissionData } = createPermissionDto;

        const role = await this.rolesRepository.findOneBy({ uuid: rolUuid });
        if (!role) throw new NotFoundException('Rol no encontrado');

        const permission = this.permissionRepository.create({
            ...permissionData,
            rol: role,
        });
        return await this.permissionRepository.save(permission);
    }

    async findAll(): Promise<Permissions[]> {
        return await this.permissionRepository.find({ relations: ['rol'] });
    }

    async findOneByUuid(uuid: string): Promise<Permissions> {
        const permission = await this.permissionRepository.findOne({
            where: { uuid },
            relations: ['rol']
        });
        if (!permission) throw new NotFoundException('Permiso no encontrado');
        return permission;
    }

    async update(uuid: string, updatePermissionDto: CreatePermissionDto): Promise<Permissions> {
        const permission = await this.findOneByUuid(uuid);
        const { rolUuid, ...permissionData } = updatePermissionDto;

        if (rolUuid) {
            const role = await this.rolesRepository.findOneBy({ uuid: rolUuid });
            if (!role) throw new NotFoundException('Rol no encontrado');
            permission.rol = role;
        }
        Object.assign(permission, permissionData);

        return await this.permissionRepository.save(permission);
    }

    async remove(uuid: string): Promise<void> {
        const permission = await this.findOneByUuid(uuid);
        await this.permissionRepository.remove(permission);
    }
}
