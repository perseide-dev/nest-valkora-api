import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AuthService } from '../modules/auth/service/auth.service';

/**
 * Script CLI para inicializar el sistema Valkora-API.
 * Permite pasar argumentos personalizados:
 * --email=tu@email.com --user=nombre --pass=contraseña
 */
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);

  // Parsing manual de argumentos simples
  const args = process.argv.slice(2);
  const customData: any = {};

  args.forEach(arg => {
    if (arg.startsWith('--email=')) customData.email = arg.split('=')[1];
    if (arg.startsWith('--user=')) customData.userName = arg.split('=')[1];
    if (arg.startsWith('--pass=')) customData.password = arg.split('=')[1];
  });

  console.log('--- Valkora CLI: Iniciando Setup del Sistema ---');
  if (Object.keys(customData).length > 0) {
    console.log('Usando datos personalizados:', customData);
  } else {
    console.log('No se pasaron argumentos. Usando valores por defecto.');
  }

  try {
    const result = await authService.initializeSystem(customData);
    console.log('Resultado:', result.message);
    if (result.credentials) {
      console.log('--- Credenciales de Administración ---');
      console.log(`Email:    ${result.credentials.email}`);
      console.log(`Username: ${result.credentials.userName}`);
      console.log(`Password: ${result.credentials.password}`);
      console.log('---------------------------------------');
    }
  } catch (error) {
    console.error('Error durante la inicialización:', error.message);
  } finally {
    await app.close();
    process.exit(0);
  }
}

bootstrap();
