import { ProfileService } from './service/profile.service';
import { ProfileController } from './controller/profile.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [ProfileController,],
  providers: [ProfileService,],
  exports: []
})
export class ProfileModule { }
