import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileService } from './service/profile.service';
import { ProfileController } from './controller/profile.controller';
import { Profile } from './entities/profile.entity';
import { Assets } from './entities/assets.enttity';
import { Lover } from './entities/lover.entity';
import { ProfileInfo } from './entities/profileInfo.entity';
import { Users } from '../users/entities/user.entity';
import { Permissions } from '../permissions/entities/permissions.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile, Assets, Lover, ProfileInfo, Users, Permissions]),
    AuthModule, // Para el SessionGuard
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule { }
