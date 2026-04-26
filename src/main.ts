import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { StandardResponseInterceptor } from './common/interceptors/standard-response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Configuración de Prefijo Global
  app.setGlobalPrefix('api/v1');

  // 2. Habilitar validación de DTOs y formateo de errores globalmente
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // 3. Habilitar Filtro de Excepciones Global
  app.useGlobalFilters(new HttpExceptionFilter());

  // 4. Habilitar Interceptores Globales (Respuesta estándar y Serialización)
  app.useGlobalInterceptors(
    new StandardResponseInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector))
  );

  // 5. Habilitar Cookie Parser para JWT en cookies
  app.use(cookieParser());

  // 6. CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3115);
}
bootstrap();
