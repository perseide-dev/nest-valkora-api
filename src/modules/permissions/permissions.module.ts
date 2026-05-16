import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permissions } from './entities/permissions.entity';
import { PermissionService } from './services/permission.service';
import { PermissionController } from './controller/permission.controller';
import { AuthModule } from '../auth/auth.module';
import { Users } from '../users/entities/user.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { Roles } from '../roles/entities/roles.entity';
import { ControlGroup } from '../control-groups/entities/control-group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permissions, Users, Profile, Roles, ControlGroup]),
    forwardRef(() => AuthModule),
  ],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService, TypeOrmModule],
})
export class PermissionsModule {}
