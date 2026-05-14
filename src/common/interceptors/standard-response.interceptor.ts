import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { instanceToPlain } from 'class-transformer';

export interface Response<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: any;
}

@Injectable()
export class StandardResponseInterceptor<T>
  implements NestInterceptor<T, any>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Manejar respuestas paginadas
        if (data && data.data && data.meta) {
          return {
            success: true,
            data: this.transform(data.data),
            meta: data.meta,
          };
        }

        // Manejar mensajes de éxito simples
        if (data && data.message && Object.keys(data).length === 1) {
          return {
            success: true,
            message: data.message
          };
        }

        return {
          success: true,
          data: this.transform(data),
        };
      }),
    );
  }

  private transform(data: any): any {
    if (data === null || data === undefined) return data;
    
    if (Array.isArray(data)) {
      return data.map((item) => this.transform(item));
    }

    if (typeof data !== 'object' || data instanceof Date) {
      return data;
    }

    const entityName = data.constructor.name;
    // Si es un objeto plano o ya está transformado, lo devolvemos
    if (entityName === 'Object' || data.entity) {
        return data;
    }

    const attributes: any = {};
    const includes: any = {};

    // Obtenemos la versión serializada (respetando @Exclude) para los atributos
    const plainData = instanceToPlain(data);

    Object.keys(data).forEach((key) => {
      const value = data[key];
      
      // Consideramos relación si el valor original es un objeto con constructor propio (entidad)
      // O un array de entidades
      if (value && typeof value === 'object' && !(value instanceof Date)) {
          if (Array.isArray(value)) {
              if (value.length > 0 && value[0] && typeof value[0] === 'object' && value[0].constructor.name !== 'Object') {
                  includes[key] = this.transform(value);
              } else if (plainData.hasOwnProperty(key)) {
                  attributes[key] = plainData[key];
              }
          } else if (value.constructor.name !== 'Object') {
              includes[key] = this.transform(value);
          } else if (plainData.hasOwnProperty(key)) {
              attributes[key] = plainData[key];
          }
      } else if (plainData.hasOwnProperty(key)) {
        attributes[key] = plainData[key];
      }
    });

    return {
      entity: entityName,
      attributes,
      includes: Object.keys(includes).length > 0 ? includes : undefined,
    };
  }
}
