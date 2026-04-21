import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permissions } from '../entities/permissions.entity';
import { CreatePermissionDto } from '../dto/create-permission.dto';

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(Permissions)
        private readonly permissionRepository: Repository<Permissions>,
    ) { }

    async create(createPermissionDto: CreatePermissionDto): Promise<Permissions> {
        const { rolId, ...permissionData } = createPermissionDto;
        const permission = this.permissionRepository.create({
            ...permissionData,
            rol: { id: rolId } as any,
        });
        return await this.permissionRepository.save(permission);
    }

    async findAll(): Promise<Permissions[]> {
        return await this.permissionRepository.find({ relations: ['rol'] });
    }

    async findOne(id: number): Promise<Permissions> {
        const permission = await this.permissionRepository.findOne({
            where: { id },
            relations: ['rol']
        });
        if (!permission) throw new NotFoundException('Permiso no encontrado');
        return permission;
    }

    async update(id: number, updatePermissionDto: CreatePermissionDto): Promise<Permissions> {
        const permission = await this.findOne(id);
        const { rolId, ...permissionData } = updatePermissionDto;
        
        if (rolId) permission.rol = { id: rolId } as any;
        Object.assign(permission, permissionData);
        
        return await this.permissionRepository.save(permission);
    }

    async remove(id: number): Promise<void> {
        const permission = await this.findOne(id);
        await this.permissionRepository.remove(permission);
    }
}
