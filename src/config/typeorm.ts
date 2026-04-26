import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Users } from '../modules/users/entities/user.entity';
import { Roles } from '../modules/roles/entities/roles.entity';
import { Permissions } from '../modules/permissions/entities/permissions.entity';
import { ControlGroup } from '../modules/control-groups/entities/control-group.entity';
import { Profile } from '../modules/profiles/entities/profile.entity';
import { Assets } from '../modules/profiles/entities/assets.enttity';
import { Lover } from '../modules/profiles/entities/lover.entity';
import { ProfileInfo } from '../modules/profiles/entities/profileInfo.entity';

config(); // Cargar .env

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
        Users,
        Roles,
        Permissions,
        ControlGroup,
        Profile,
        Assets,
        Lover,
        ProfileInfo
    ],
    migrations: [__dirname + '/../database/migrations/*.ts'],
    synchronize: false, // Siempre false al usar migraciones
});
