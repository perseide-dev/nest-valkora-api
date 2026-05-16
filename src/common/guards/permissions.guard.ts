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
import { Profile } from 'src/modules/profiles/entities/profile.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        @InjectRepository(Users)
        private readonly userRepository: Repository<Users>,
        @InjectRepository(Permissions)
        private readonly permissionRepository: Repository<Permissions>,
        @InjectRepository(Profile)
        private readonly profileRepository: Repository<Profile>,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const metadata = this.reflector.get<PermissionMetadata>(PERMISSIONS_KEY, context.getHandler());
        if (!metadata) return true;

        const request = context.switchToHttp().getRequest();
        const userPayload = request.user;
        if (!userPayload) return false;

        // 1. Cargar usuario con su ROL
        const user = await this.userRepository.findOne({
            where: { uuid: userPayload.sub },
            relations: ['rol'],
        });

        if (!user || !user.rol) throw new ForbiddenException('Usuario o Rol no encontrado');

        // 2. Buscar TODOS los permisos para este Rol y Módulo
        const permissions = await this.permissionRepository.find({
            where: {
                rol: { id: user.rol.id },
                module: metadata.module,
            },
            relations: ['controlGroup']
        });

        if (permissions.length === 0) {
            throw new ForbiddenException(`No tienes permisos definidos para el módulo ${metadata.module}`);
        }

        // 3. Filtrar los que tienen la acción permitida
        const validPermissions = permissions.filter(p => p[metadata.action]);
        if (validPermissions.length === 0) {
            throw new ForbiddenException(`No tienes permiso para ${metadata.action} en ${metadata.module}`);
        }

        // 4. Evaluar el Focus (Alcance)
        // Si alguno es ALL, permitimos de inmediato
        if (validPermissions.some(p => p.focus === Focus.ALL)) return true;

        const resourceId = request.params.uuid;

        // Si no hay ID de recurso (ej. un findAll), y el foco no es ALL, permitimos pasar 
        // pero el SERVICIO debe ser el encargado de filtrar los resultados.
        if (!resourceId) {
            if (metadata.action === 'create') return true;
            return true; 
        }

        // Evaluación de permisos uno por uno hasta encontrar uno que autorice
        for (const permission of validPermissions) {
            if (permission.focus === Focus.SELF) {
                // Regla especial: READ en Profiles es público
                if (metadata.module === Modules.Profiles && metadata.action === 'read') return true;

                if (metadata.module === Modules.Users) {
                    if (resourceId === user.uuid) return true;
                }

                if (metadata.module === Modules.Profiles && (metadata.action === 'update' || metadata.action === 'delete')) {
                    const profile = await this.profileRepository.findOne({
                        where: { uuid: resourceId },
                        relations: ['user']
                    });
                    if (profile && profile.user.id === user.id) return true;
                }
            }

            if (permission.focus === Focus.CONTROL_GROUP && permission.controlGroup) {
                if (metadata.module === Modules.Users) {
                    const targetUser = await this.userRepository.findOne({
                        where: { uuid: resourceId },
                        relations: ['controlGroups'],
                    });
                    
                    if (targetUser) {
                        const isInGroup = targetUser.controlGroups.some(g => g.id === permission.controlGroup.id);
                        if (isInGroup) return true;
                    }
                }
                // Si el módulo no es Users, se podría implementar lógica similar para otros recursos
                // que estén vinculados a grupos de control.
            }
        }

        // Si después de revisar todos los permisos ninguno autorizó el acceso al recurso específico
        throw new ForbiddenException('No tienes autorización sobre este recurso específico');
    }
}
