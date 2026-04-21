import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Users } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ControlGroup } from 'src/modules/control-groups/entities/control-group.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(ControlGroup)
    private readonly controlGroupRepository: Repository<ControlGroup>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<Users> {
    const { password, controlGroupIds, rolId, ...userData } = createUserDto;

    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findOne({
      where: [{ email: userData.email }, { userName: userData.userName }]
    });
    if (existingUser) throw new ConflictException('Email o Username ya están en uso');

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Buscar grupos de control si se proporcionaron
    let controlGroups: ControlGroup[] = [];
    if (controlGroupIds && controlGroupIds.length > 0) {
      controlGroups = await this.controlGroupRepository.findBy({
        id: In(controlGroupIds)
      });
    }

    const newUser = this.userRepository.create({
      ...userData,
      password: hashedPassword,
      rol: { id: rolId } as any,
      controlGroups
    });

    return await this.userRepository.save(newUser);
  }

  async findAll(): Promise<Users[]> {
    return await this.userRepository.find({ relations: ['rol', 'controlGroups'] });
  }

  async findOneByEmail(email: string): Promise<Users> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['rol', 'controlGroups']
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async findOneById(id: string | number): Promise<Users> {
    const user = await this.userRepository.findOne({
      where: { id: Number(id) },
      relations: ['rol', 'controlGroups']
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async update(id: string | number, updateUserDto: UpdateUserDto): Promise<Users> {
    const user = await this.findOneById(id);
    const { password, controlGroupIds, rolId, ...userData } = updateUserDto;

    if (password) {
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(password, salt);
    }

    if (rolId) user.rol = { id: rolId } as any;

    if (controlGroupIds) {
      user.controlGroups = await this.controlGroupRepository.findBy({
        id: In(controlGroupIds)
      });
    }

    Object.assign(user, userData);
    return await this.userRepository.save(user);
  }

  async remove(id: string | number): Promise<void> {
    const user = await this.findOneById(id);
    await this.userRepository.remove(user);
  }

  async updateRefreshToken(id: string | number, refreshToken: string | undefined): Promise<void> {
    await this.userRepository.update(id, { hashedRefreshToken: refreshToken });
  }
}
