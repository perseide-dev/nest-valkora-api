import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.header('x-api-key');

    if (!apiKey) {
      throw new UnauthorizedException('API Key is missing');
    }


    const isValid = await this.validateApiKey(apiKey);
    if (!isValid) throw new UnauthorizedException('Invalid API Key');

    return true;
  }

  private async validateApiKey(key: string): Promise<boolean> {
    return true; // Implement logic if needed
  }
}