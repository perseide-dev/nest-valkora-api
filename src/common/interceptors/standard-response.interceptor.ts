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
    const request = context.switchToHttp().getRequest();
    const includeQuery = request.query.include || '';
    const allowedIncludes = includeQuery ? includeQuery.split(',').map((i: string) => i.trim()) : [];

    return next.handle().pipe(
      map((data) => {
        if (data === null || data === undefined) return { success: true, data };

        // 1. Manejar respuestas paginadas
        if (data.data && data.meta) {
          return {
            success: true,
            data: this.transform(data.data, allowedIncludes),
            meta: data.meta,
          };
        }

        // 2. Manejar mensajes de éxito simples
        if (data.message && Object.keys(data).length === 1) {
          return {
            success: true,
            message: data.message
          };
        }

        // 3. Manejar respuestas con mensaje y una entidad principal (ej: Login)
        if (data.message) {
            const keys = Object.keys(data);
            const entityKey = keys.find(k => k !== 'message' && data[k] && typeof data[k] === 'object' && data[k].constructor.name !== 'Object');
            
            if (entityKey && keys.length === 2) {
                return {
                    success: true,
                    message: data.message,
                    data: this.transform(data[entityKey], allowedIncludes)
                };
            }
        }

        // 4. Respuesta estándar
        return {
          success: true,
          data: this.transform(data, allowedIncludes),
        };
      }),
    );
  }

  private transform(data: any, allowedIncludes: string[] = [], currentPath: string = ''): any {
    if (data === null || data === undefined) return data;
    
    if (Array.isArray(data)) {
      return data.map((item) => this.transform(item, allowedIncludes, currentPath));
    }

    if (typeof data !== 'object' || data instanceof Date) {
      return data;
    }

    const entityName = data.constructor.name;
    
    // Si es un objeto plano, transformamos sus propiedades recursivamente
    if (entityName === 'Object') {
        const transformed: any = {};
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                transformed[key] = this.transform(data[key], allowedIncludes, currentPath);
            }
        }
        return transformed;
    }

    // Si ya está transformado, lo devolvemos
    if (data.entity) {
        return data;
    }

    const attributes: any = {};
    const relationships: any = {};
    const plainData = instanceToPlain(data);

    Object.keys(data).forEach((key) => {
      const value = data[key];
      const fullPath = currentPath ? `${currentPath}.${key}` : key;
      
      // Si el valor no está en plainData (excluido por @Exclude) y no es un objeto, lo ignoramos para atributos
      if (!plainData.hasOwnProperty(key) && (typeof value !== 'object' || value === null)) {
          return;
      }

      const transformedValue = this.transform(value, allowedIncludes, fullPath);

      // Determinamos si el valor es una entidad o un array de entidades
      const isEntity = transformedValue && typeof transformedValue === 'object' && transformedValue.entity;
      const isEntityArray = Array.isArray(transformedValue) && transformedValue.length > 0 && transformedValue[0].entity;

      if (isEntity || isEntityArray) {
          // SOLO lo movemos a relationships si el path está en allowedIncludes o es padre de uno
          const isAllowed = allowedIncludes.some(inc => inc === fullPath || inc.startsWith(`${fullPath}.`));
          
          if (isAllowed) {
              relationships[key] = transformedValue;
          }
          // Si no está permitido, simplemente no se incluye en la respuesta final (ni en attributes ni en relationships)
      } else {
          // Si no es entidad, va a attributes usando el valor de plainData para respetar decoradores
          if (plainData.hasOwnProperty(key)) {
              attributes[key] = plainData[key];
          }
      }
    });

    return {
      entity: entityName,
      attributes,
      relationships: Object.keys(relationships).length > 0 ? relationships : undefined,
    };
  }
}
