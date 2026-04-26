import { AppDataSource } from '../../config/typeorm';
import { Roles } from '../../modules/roles/entities/roles.entity';
import { Permissions } from '../../modules/permissions/entities/permissions.entity';
import { Modules } from '../../common/enums/module.enum';
import { Focus } from '../../common/enums/focus.enum';

async function run() {
    await AppDataSource.initialize();
    console.log('🌱 Data Source has been initialized!');

    const roleRepository = AppDataSource.getRepository(Roles);
    const permissionRepository = AppDataSource.getRepository(Permissions);

    // 1. Crear Roles base
    let superAdmin = await roleRepository.findOne({ where: { rolName: 'SUPER_ADMIN' } });
    if (!superAdmin) {
        superAdmin = roleRepository.create({ rolName: 'SUPER_ADMIN' });
        await roleRepository.save(superAdmin);
        console.log('✅ Role SUPER_ADMIN created');
    }

    let userRole = await roleRepository.findOne({ where: { rolName: 'USER' } });
    if (!userRole) {
        userRole = roleRepository.create({ rolName: 'USER' });
        await roleRepository.save(userRole);
        console.log('✅ Role USER created');
    }

    // 2. Permisos para SUPER_ADMIN (ALL en TODO)
    const modules = Object.values(Modules);
    for (const module of modules) {
        const existing = await permissionRepository.findOne({
            where: { rol: { id: superAdmin.id }, module }
        });
        if (!existing) {
            const perm = permissionRepository.create({
                permissionName: `ADMIN_${module}`,
                module,
                rol: superAdmin,
                focus: Focus.ALL,
                create: true,
                read: true,
                update: true,
                delete: true
            });
            await permissionRepository.save(perm);
            console.log(`✅ Permission ADMIN_${module} created for SUPER_ADMIN`);
        }
    }

    // 3. Permisos para USER (Específicos para PROFILES como pidió el usuario)
    // El usuario puede crear, leer y actualizar perfiles.
    // Solo puede modificar los suyos (SELF), pero ver todos (ALL)? 
    // Como mencionamos, focus SELF aplicará a CUD.
    const userProfilePerm = await permissionRepository.findOne({
        where: { rol: { id: userRole.id }, module: Modules.Profiles }
    });

    if (!userProfilePerm) {
        const perm = permissionRepository.create({
            permissionName: 'USER_PROFILES',
            module: Modules.Profiles,
            rol: userRole,
            focus: Focus.SELF, // Por defecto SELF para proteger la edición
            create: true,
            read: true,
            update: true,
            delete: false
        });
        await permissionRepository.save(perm);
        console.log('✅ Permission USER_PROFILES created for USER (Focus: SELF)');
    }

    await AppDataSource.destroy();
    console.log('🏁 Seeding finished!');
}

run().catch((error) => console.log('❌ Error during seeding:', error));
