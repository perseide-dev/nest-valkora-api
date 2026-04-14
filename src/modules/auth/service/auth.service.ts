import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../users/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async login(loginDto: LoginUserDto) {
    const user = await this.usersService.findOneByEmail(loginDto.email);

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
      const isMatch = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
      if (!isMatch) throw new UnauthorizedException();

      // 2. Generate new Access Token
      const accessToken = this.jwtService.sign({ sub: user.id, email: user.email }, { expiresIn: '15m' });

      return { accessToken };
    } catch {
      throw new UnauthorizedException();
    }
  }


}