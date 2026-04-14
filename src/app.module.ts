// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from './config/app.config';

@Module({
  imports: [
    // 1. Configuración Global
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),

    // 2. Base de Datos (Async para esperar al ConfigService)
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // Obtenemos el objeto validado de app.config.ts
        const dbConfig = configService.get('config');

        return {
          type: 'postgres', // O el motor que uses
          host: dbConfig.DB_HOST,
          port: dbConfig.DB_PORT,
          username: dbConfig.DB_USER,
          password: dbConfig.DB_PASSWORD,
          database: dbConfig.DB_NAME,
          autoLoadEntities: true, // Carga automática de .entity.ts
          synchronize: process.env.NODE_ENV !== 'production', // Solo en dev
          logging: process.env.NODE_ENV === 'development',
        };
      },
    }),

    // Tus otros módulos
    // AuthModule, UsersModule...
  ],
})
export class AppModule { }