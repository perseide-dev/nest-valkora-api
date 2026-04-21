import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PERMISSIONS_KEY, PermissionMetadata } from '../decorators/permissions.decorator';
import { Users } from 'src/modules/users/entities/user.entity';
import { Permissions } from 'src/modules/permissions/entities/permissions.entity';
import { Focus } from '../enums/focus.enum';
import { Modules } from '../enums/module.enum';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        @InjectRepository(Users)
        private readonly userRepository: Repository<Users>,
        @InjectRepository(Permissions)
        private readonly permissionRepository: Repository<Permissions>,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const metadata = this.reflector.get<PermissionMetadata>(PERMISSIONS_KEY, context.getHandler());
        if (!metadata) return true;

        const request = context.switchToHttp().getRequest();
        const userPayload = request.user;
        if (!userPayload) return false;

        // 1. Cargar usuario con su ROL y Grupos de Control
        const user = await this.userRepository.findOne({
            where: { id: userPayload.sub },
            relations: ['rol', 'controlGroups'],
        });

        if (!user || !user.rol) throw new ForbiddenException('Usuario o Rol no encontrado');

        // 2. Buscar el permiso específico para este Rol y Módulo
        const permission = await this.permissionRepository.findOne({
            where: {
                rol: { id: user.rol.id },
                module: metadata.module,
            }
        });

        if (!permission) throw new ForbiddenException(`No tienes permisos definidos para el módulo ${metadata.module}`);

        // 3. Verificar la acción booleana
        const hasAction = permission[metadata.action];
        if (!hasAction) throw new ForbiddenException(`No tienes permiso para ${metadata.action} en ${metadata.module}`);

        // 4. Verificar el Focus (Alcance)
        if (permission.focus === Focus.ALL) return true;

        const resourceId = request.params.id;

        // Si no hay ID de recurso (ej. un findAll), y el foco no es ALL, depende de la implementación.
        // Por ahora, si es un GET plural, permitimos y dejamos que el servicio filtre, o bloqueamos.
        // El usuario pidió que se relacionara al grupo de control.
        if (!resourceId) {
            // Para creación (POST), el focus SELF/CONTROL_GROUP suele ser válido.
            if (metadata.action === 'create') return true;
            
            // Para lectura de listas, si no es ALL, el Guard permite pasar pero el SERVICIO debe filtrar.
            return true; 
        }

        // Lógica de FOCUS para recursos específicos (ID presente)
        if (permission.focus === Focus.SELF) {
            // En el módulo de USERS, SELF significa que el ID solicitado es el mío.
            if (metadata.module === Modules.Users) {
                if (Number(resourceId) !== Number(user.id)) {
                    throw new ForbiddenException('Solo puedes acceder a tus propios datos');
                }
            }
            // Para otros módulos (ej. Profiles), se necesitaría buscar el dueño del recurso.
            // Por ahora implementamos la lógica de USERS que es lo solicitado.
            return true;
        }

        if (permission.focus === Focus.CONTROL_GROUP) {
            if (metadata.module === Modules.Users) {
                const targetUser = await this.userRepository.findOne({
                    where: { id: Number(resourceId) },
                    relations: ['controlGroups'],
                });
                if (!targetUser) throw new NotFoundException('Usuario objetivo no encontrado');

                // Verificar intersección de grupos
                const userGroupIds = user.controlGroups.map(g => g.id);
                const targetGroupIds = targetUser.controlGroups.map(g => g.id);
                const hasIntersection = userGroupIds.some(id => targetGroupIds.includes(id));

                if (!hasIntersection) {
                    throw new ForbiddenException('El usuario no pertenece a ninguno de tus grupos de control');
                }
            }
            return true;
        }

        return false;
    }
}
