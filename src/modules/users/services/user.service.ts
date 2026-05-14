import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Users } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ControlGroup } from 'src/modules/control-groups/entities/control-group.entity';
import { Roles } from 'src/modules/roles/entities/roles.entity';
import { generateRandomAccountName } from 'src/common/utils/random-name.util';
import { BaseQueryDto } from 'src/common/dto/base-query.dto';
import { parseIncludes } from 'src/common/utils/typeorm-query.helper';
import { PaginatedResponse } from 'src/common/dto/pagination.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(ControlGroup)
    private readonly controlGroupRepository: Repository<ControlGroup>,
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<Users> {
    const { password, controlGroupUuids, rolUuid, ...userData } = createUserDto;

    // Generar accountName random si no fue proporcionado
    if (!userData.accountName) {
      userData.accountName = generateRandomAccountName();
    }

    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findOne({
      where: [{ email: userData.email }, { userName: userData.userName }]
    });
    if (existingUser) throw new ConflictException('Email o Username ya están en uso');

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Buscar rol por UUID
    const role = await this.rolesRepository.findOneBy({ uuid: rolUuid });
    if (!role) throw new NotFoundException('Rol no encontrado');

    // Buscar grupos de control si se proporcionaron
    let controlGroups: ControlGroup[] = [];
    if (controlGroupUuids && controlGroupUuids.length > 0) {
      controlGroups = await this.controlGroupRepository.findBy({
        uuid: In(controlGroupUuids)
      });
    }

    const newUser = this.userRepository.create({
      ...userData,
      password: hashedPassword,
      rol: role,
      controlGroups
    });

    return await this.userRepository.save(newUser);
  }

  async findAll(query: BaseQueryDto): Promise<PaginatedResponse<Users>> {
    const { page = 1, limit = 10, include } = query;
    const skip = (page - 1) * limit;
    const relations = parseIncludes(include);

    const [data, total] = await this.userRepository.findAndCount({
      skip,
      take: limit,
      relations: {
          ...relations,
          rol: relations.rol || true,
          controlGroups: relations.controlGroups || true,
      },
    });

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
        limit,
      },
    };
  }

  async findOneByEmail(email: string): Promise<Users> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['rol', 'controlGroups']
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async findOneByIdentity(identity: string): Promise<Users> {
    const user = await this.userRepository.findOne({
      where: [
        { email: identity },
        { userName: identity }
      ],
      relations: ['rol', 'controlGroups']
    });
    if (!user) throw new NotFoundException('Usuario no encontrado por email o username');
    return user;
  }

  async findOneByUuid(uuid: string, query?: BaseQueryDto): Promise<Users> {
    const relations = parseIncludes(query?.include);
    const user = await this.userRepository.findOne({
      where: { uuid },
      relations: {
          ...relations,
          rol: relations.rol || true,
          controlGroups: relations.controlGroups || true,
      },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async update(uuid: string, updateUserDto: UpdateUserDto): Promise<Users> {
    const user = await this.findOneByUuid(uuid);
    const { password, controlGroupUuids, rolUuid, ...userData } = updateUserDto;

    if (password) {
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(password, salt);
    }

    if (rolUuid) {
      const role = await this.rolesRepository.findOneBy({ uuid: rolUuid });
      if (!role) throw new NotFoundException('Rol no encontrado');
      user.rol = role;
    }

    if (controlGroupUuids) {
      user.controlGroups = await this.controlGroupRepository.findBy({
        uuid: In(controlGroupUuids)
      });
    }

    Object.assign(user, userData);
    return await this.userRepository.save(user);
  }

  async remove(uuid: string): Promise<void> {
    const user = await this.findOneByUuid(uuid);
    await this.userRepository.remove(user);
  }

  async updateRefreshToken(uuid: string, refreshToken: string | undefined): Promise<void> {
    await this.userRepository.update({ uuid }, { hashedRefreshToken: refreshToken });
  }
}
