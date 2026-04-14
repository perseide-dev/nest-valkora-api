import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async findOneByEmail(email: string): Promise<Users> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async findOneById(id: string | number): Promise<Users> {
    const user = await this.userRepository.findOne({ where: { id: Number(id) } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async updateRefreshToken(id: string | number, refreshToken: string | undefined): Promise<void> {
    await this.userRepository.update(id, { hashedRefreshToken: refreshToken });
  }
}
