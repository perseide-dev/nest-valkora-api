import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../users/services/user.service';
import { LoginUserDto } from '../dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roles } from 'src/modules/roles/entities/roles.entity';
import { Permissions } from 'src/modules/permissions/entities/permissions.entity';
import { Users } from 'src/modules/users/entities/user.entity';
import { Modules } from 'src/common/enums/module.enum';
import { Focus } from 'src/common/enums/focus.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(Roles)
    private readonly roleRepository: Repository<Roles>,
    @InjectRepository(Permissions)
    private readonly permissionRepository: Repository<Permissions>,
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) { }

  async login(loginDto: LoginUserDto) {
    const user = await this.usersService.findOneByIdentity(loginDto.email);

    // 1. Validate password
    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Credenciales inválidas');

    // 2. Generate Tokens
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // 3. Hash and store the refresh token in the database to maintain the session
    const salt = await bcrypt.genSalt();
    const hashedRT = await bcrypt.hash(refreshToken, salt);
    await this.usersService.updateRefreshToken(user.id, hashedRT);

    return { user, accessToken, refreshToken };
  }

  async refreshSession(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);
      const user = await this.usersService.findOneById(payload.sub);

      // 1. Compare the refresh token with the hash stored in the database
      if (!user.hashedRefreshToken) throw new UnauthorizedException('Sesión no encontrada');
      const isMatch = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
      if (!isMatch) throw new UnauthorizedException();

      // 2. Generate new Access Token
      const accessToken = this.jwtService.sign({ sub: user.id, email: user.email }, { expiresIn: '15m' });

      return { accessToken };
    } catch {
      throw new UnauthorizedException();
    }
  }


  /**
   * Inicializa el sistema creando el rol SUPER_ADMIN, permisos y el primer usuario.
   * Método diseñado para ser llamado desde el controlador (con API Key) o desde el CLI.
   */
  async initializeSystem(customData?: { email?: string; userName?: string; password?: string }) {
    // 1. Crear Rol SUPER_ADMIN si no existe
    let adminRole = await this.roleRepository.findOne({ where: { rolName: 'SUPER_ADMIN' } });
    if (!adminRole) {
      adminRole = this.roleRepository.create({ rolName: 'SUPER_ADMIN' });
      adminRole = await this.roleRepository.save(adminRole);
    }

    // 2. Crear Permisos para todos los módulos
    const modules = Object.values(Modules);
    for (const moduleName of modules) {
      let perm = await this.permissionRepository.findOne({
        where: { rol: { id: adminRole.id }, module: moduleName }
      });

      if (!perm) {
        perm = this.permissionRepository.create({
          permissionName: `ALL_ACCESS_${moduleName}`,
          module: moduleName,
          focus: Focus.ALL,
          create: true,
          read: true,
          update: true,
          delete: true,
          rol: adminRole
        });
        await this.permissionRepository.save(perm);
      }
    }

    // 3. Crear Primer Usuario si no hay ninguno
    const userCount = await this.userRepository.count();
    if (userCount === 0) {
      const email = customData?.email || 'admin@valkora.com';
      const userName = customData?.userName || 'superadmin';
      const password = customData?.password || 'admin123';

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const adminUser = this.userRepository.create({
        userName,
        accountName: 'Super Admin',
        email,
        password: hashedPassword,
        rol: adminRole,
        isActive: true,
        isAprove: true
      });
      await this.userRepository.save(adminUser);
      return { 
        message: 'Setup completado exitosamente.', 
        credentials: { email, userName, password } 
      };
    }

    return { message: 'El sistema ya ha sido inicializado anteriormente' };
  }

  /**
   * Wrapper para el controlador que valida la API Key antes de inicializar.
   */
  async setupInitialData(apiKey: string) {
    const systemApiKey = this.configService.get('config.API_KEY_SYSTEM');
    if (apiKey !== systemApiKey) throw new UnauthorizedException('API Key inválida');
    return this.initializeSystem();
  }
}