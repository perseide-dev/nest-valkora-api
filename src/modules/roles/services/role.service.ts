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

    async findOneByUuid(uuid: string): Promise<Roles> {
        const role = await this.roleRepository.findOne({
            where: { uuid },
            relations: ['permissions']
        });
        if (!role) throw new NotFoundException('Rol no encontrado');
        return role;
    }

    async update(uuid: string, updateRoleDto: CreateRoleDto): Promise<Roles> {
        const role = await this.findOneByUuid(uuid);
        Object.assign(role, updateRoleDto);
        return await this.roleRepository.save(role);
    }

    async remove(uuid: string): Promise<void> {
        const role = await this.findOneByUuid(uuid);
        await this.roleRepository.remove(role);
    }
}
