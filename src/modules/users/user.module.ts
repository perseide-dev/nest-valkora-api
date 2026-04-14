import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { UsersService } from './services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [],
  providers: [UsersService],
  exports: [UsersService]
})
export class UserModule {}
