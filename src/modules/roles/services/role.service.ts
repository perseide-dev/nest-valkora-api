import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roles } from '../entities/roles.entity';
import { CreateRoleDto } from '../dto/create-role.dto';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Roles)
        private readonly roleRepository: Repository<Roles>,
    ) { }

    async create(createRoleDto: CreateRoleDto): Promise<Roles> {
        const role = this.roleRepository.create(createRoleDto);
        return await this.roleRepository.save(role);
    }

    async findAll(): Promise<Roles[]> {
        return await this.roleRepository.find({ relations: ['permissions'] });
    }

    async findOne(id: number): Promise<Roles> {
        const role = await this.roleRepository.findOne({
            where: { id },
            relations: ['permissions']
        });
        if (!role) throw new NotFoundException('Rol no encontrado');
        return role;
    }

    async update(id: number, updateRoleDto: CreateRoleDto): Promise<Roles> {
        const role = await this.findOne(id);
        Object.assign(role, updateRoleDto);
        return await this.roleRepository.save(role);
    }

    async remove(id: number): Promise<void> {
        const role = await this.findOne(id);
        await this.roleRepository.remove(role);
    }
}
