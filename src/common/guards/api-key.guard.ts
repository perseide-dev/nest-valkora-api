import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private configService: ConfigService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.header('x-api-key');

    if (!apiKey) {
      throw new UnauthorizedException('API Key is missing');
    }

    const systemApiKey = this.configService.get('config.API_KEY_SYSTEM');

    if (apiKey !== systemApiKey) {
      throw new UnauthorizedException('Invalid API Key');
    }

    return true;
  }
}