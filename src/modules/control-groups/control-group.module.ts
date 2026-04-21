import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ControlGroup } from './entities/control-group.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ControlGroup])],
    exports: [TypeOrmModule],
})
export class ControlGroupModule {}
