import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roles } from '../entities/roles.entity';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { Permissions } from '../../permissions/entities/permissions.entity';
import { BaseQueryDto } from 'src/common/dto/base-query.dto';
import { parseIncludes } from 'src/common/utils/typeorm-query.helper';
import { PaginatedResponse } from 'src/common/dto/pagination.dto';

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

    async findAll(query: BaseQueryDto): Promise<PaginatedResponse<Roles>> {
        const { page = 1, limit = 10, include } = query;
        const skip = (page - 1) * limit;
        const relations = parseIncludes(include);

        const [data, total] = await this.roleRepository.findAndCount({
            skip,
            take: limit,
            relations: {
                ...relations,
                permissions: relations.permissions || true,
            },
        });

        return {
            data,
            meta: {
                total,
                page,
                lastPage: Math.ceil(total / limit),
                limit,
            },
        };
    }

    async findOneByUuid(uuid: string, query?: BaseQueryDto): Promise<Roles> {
        const relations = parseIncludes(query?.include);
        const role = await this.roleRepository.findOne({
            where: { uuid },
            relations: {
                ...relations,
                permissions: relations.permissions || true,
            }
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
