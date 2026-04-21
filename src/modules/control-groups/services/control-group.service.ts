import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ControlGroup } from '../entities/control-group.entity';
import { CreateControlGroupDto } from '../dto/create-control-group.dto';

@Injectable()
export class ControlGroupService {
    constructor(
        @InjectRepository(ControlGroup)
        private readonly controlGroupRepository: Repository<ControlGroup>,
    ) { }

    async create(createControlGroupDto: CreateControlGroupDto): Promise<ControlGroup> {
        const group = this.controlGroupRepository.create(createControlGroupDto);
        return await this.controlGroupRepository.save(group);
    }

    async findAll(): Promise<ControlGroup[]> {
        return await this.controlGroupRepository.find({ relations: ['users'] });
    }

    async findOne(id: number): Promise<ControlGroup> {
        const group = await this.controlGroupRepository.findOne({
            where: { id },
            relations: ['users']
        });
        if (!group) throw new NotFoundException('Grupo de Control no encontrado');
        return group;
    }

    async update(id: number, updateControlGroupDto: CreateControlGroupDto): Promise<ControlGroup> {
        const group = await this.findOne(id);
        Object.assign(group, updateControlGroupDto);
        return await this.controlGroupRepository.save(group);
    }

    async remove(id: number): Promise<void> {
        const group = await this.findOne(id);
        await this.controlGroupRepository.remove(group);
    }
}
