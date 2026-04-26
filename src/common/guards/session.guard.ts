// src/common/guards/session.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/modules/auth/service/auth.service';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
    private reflector: Reflector,
    private configService: ConfigService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Verificar si el endpoint es @Public()
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const accessToken = request.cookies['Authentication'];
    const refreshToken = request.cookies['Refresh'];

    if (!accessToken && !refreshToken) {
      throw new UnauthorizedException('No se detectó una sesión activa');
    }

    try {
      // 2. Intentar validar Access Token
      const payload = await this.jwtService.verifyAsync(accessToken);
      request['user'] = payload; // Inyectamos los datos del usuario en la request
      return true;
    } catch (error) {
      // 3. Si falló por expiración, intentamos el Silent Refresh
      if (refreshToken) {
        try {
          const { accessToken: newAccessToken } = await this.authService.refreshSession(refreshToken);

          const isProduction = this.configService.get('config.NODE_ENV') === 'production';

          // Seteamos la nueva cookie de forma transparente
          response.cookie('Authentication', newAccessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000,
          });

          request['user'] = this.jwtService.decode(newAccessToken);
          return true;
        } catch (refreshError) {
          throw new UnauthorizedException('Tu sesión ha expirado completamente');
        }
      }
      throw new UnauthorizedException('Token inválido');
    }
  }
}