import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from './entities/roles.entity';
import { RoleService } from './services/role.service';
import { RoleController } from './controller/role.controller';
import { AuthModule } from '../auth/auth.module';
import { Permissions } from '../permissions/entities/permissions.entity';
import { Users } from '../users/entities/user.entity';
import { Profile } from '../profiles/entities/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Roles, Permissions, Users, Profile]),
    forwardRef(() => AuthModule),
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService, TypeOrmModule],
})
export class RolesModule { }
