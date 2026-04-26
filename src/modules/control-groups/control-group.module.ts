import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ControlGroup } from './entities/control-group.entity';
import { ControlGroupService } from './services/control-group.service';
import { ControlGroupController } from './controller/control-group.controller';
import { AuthModule } from '../auth/auth.module';
import { Permissions } from '../permissions/entities/permissions.entity';
import { Users } from '../users/entities/user.entity';
import { Profile } from '../profiles/entities/profile.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([ControlGroup, Permissions, Users, Profile]),
        forwardRef(() => AuthModule),
    ],
    controllers: [ControlGroupController],
    providers: [ControlGroupService],
    exports: [ControlGroupService, TypeOrmModule],
})
export class ControlGroupModule { }
