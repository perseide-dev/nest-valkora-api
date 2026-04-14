import { AuthService } from './modules/auth/service/auth.service';
import { AuthController } from './modules/auth/controller/auth.controller';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AuthController, AppController],
  providers: [AuthService, AppService],
})
export class AppModule { }
