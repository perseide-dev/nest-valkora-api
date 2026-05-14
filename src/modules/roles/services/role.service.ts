import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roles } from '../entities/roles.entity';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { Permissions } from '../../permissions/entities/permissions.entity';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Roles)
        private readonly roleRepository: Repository<Roles>,
        @InjectRepository(Permissions)
        private readonly permissionRepository: Repository<Permissions>,
    ) { }

    async create(createRoleDto: CreateRoleDto): Promise<Roles> {
        const { permissions, ...roleData } = createRoleDto;
        const role = this.roleRepository.create(roleData);

        if (permissions) {
            role.permissions = permissions.map(p => this.permissionRepository.create(p));
        }

        return await this.roleRepository.save(role);
    }

    async findAll(): Promise<Roles[]> {
        return await this.roleRepository.find({ relations: ['permissions'] });
    }

    async findOneByUuid(uuid: string): Promise<Roles> {
        const role = await this.roleRepository.findOne({
            where: { uuid },
            relations: ['permissions']
        });
        if (!role) throw new NotFoundException('Rol no encontrado');
        return role;
    }

    async update(uuid: string, updateRoleDto: UpdateRoleDto): Promise<Roles> {
        const role = await this.findOneByUuid(uuid);
        const { permissions, ...roleData } = updateRoleDto;

        if (permissions) {
            // Eliminamos los permisos anteriores para reemplazarlos
            await this.permissionRepository.delete({ rol: { id: role.id } });
            role.permissions = permissions.map(p => this.permissionRepository.create(p));
        }

        Object.assign(role, roleData);
        return await this.roleRepository.save(role);
    }

    async remove(uuid: string): Promise<void> {
        const role = await this.findOneByUuid(uuid);
        await this.roleRepository.remove(role);
    }
}
