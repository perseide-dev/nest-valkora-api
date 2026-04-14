import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async login(loginDto: LoginUserDto) {
    const user = await this.usersService.findOneByEmail(loginDto.email);

    // 1. Validar contraseña
    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Credenciales inválidas');

    // 2. Generar Tokens
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // 3. Hashear y guardar el Refresh Token en DB para persistencia de sesión
    const salt = await bcrypt.genSalt();
    const hashedRT = await bcrypt.hash(refreshToken, salt);
    await this.usersService.updateRefreshToken(user.id, hashedRT);

    return { user, accessToken, refreshToken };
  }
}