import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';


@Injectable()
export class ApiKeyGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request = context.switchToHttp().getRequest();
    const apiKey = request.header('x-api-key');

    if (!apiKey) {
      throw new UnauthorizedException('API Key is required');
    }

    const isValid = await this.usersService.validateApiKey(apiKey);
    if (!isValid) {
      throw new UnauthorizedException('Invalid API Key');
    }


    return true;
  }
}
