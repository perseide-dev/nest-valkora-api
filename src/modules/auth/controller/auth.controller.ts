import { Controller, Post, Body, Res, UnauthorizedException, HttpStatus, Headers } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from '../service/auth.service';
import { LoginUserDto } from '../dto/login-user.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public() // Decorador para saltar el Guard Global de API-Key si es necesario
  @Post('login')
  async login(
    @Body() loginDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, accessToken, refreshToken } = await this.authService.login(loginDto);

    // Configuración de Cookie para Access Token (Corta duración)
    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: true, // Solo HTTPS
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutos
    });

    // Configuración de Cookie para Refresh Token (Larga duración)
    response.cookie('Refresh', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/api/auth/refresh', // Solo se envía a la ruta de refresh por seguridad
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    return {
      message: 'Login exitoso',
      user: {
        username: user.userName,
        email: user.email,
        rol: user.rol,
      },
    };
  }

  @Public()
  @Post('setup')
  async setup(@Headers('x-api-key') apiKey: string) {
    return this.authService.setupInitialData(apiKey);
  }
}