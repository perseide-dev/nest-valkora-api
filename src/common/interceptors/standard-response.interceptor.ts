import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: any;
}

@Injectable()
export class StandardResponseInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // Si la respuesta ya tiene el formato esperado (p. ej. de la paginación), la respetamos
        if (data && data.data && data.meta) {
          return {
            success: true,
            message: 'Operación exitosa',
            data: data.data,
            meta: data.meta,
          };
        }

        return {
          success: true,
          message: data?.message || 'Operación exitosa',
          data: data?.user || data?.data || data, // Desempaquetamos si es necesario
        };
      }),
    );
  }
}
