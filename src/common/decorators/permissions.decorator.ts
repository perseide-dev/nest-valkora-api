import { SetMetadata } from '@nestjs/common';
import { Modules } from '../enums/module.enum';

export type PermissionAction = 'create' | 'read' | 'update' | 'delete';

export interface PermissionMetadata {
    module: Modules;
    action: PermissionAction;
}

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (module: Modules, action: PermissionAction) =>
    SetMetadata(PERMISSIONS_KEY, { module, action });
