import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { UsersService } from './services/user.service';
import { ControlGroup } from '../control-groups/entities/control-group.entity';
import { Permissions } from '../permissions/entities/permissions.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { UsersController } from './controller/user.controller';
import { AuthModule } from '../auth/auth.module';
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, ControlGroup, Permissions, Profile]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UserModule {}
