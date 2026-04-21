import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany
} from 'typeorm';
import { Users } from 'src/modules/users/entities/user.entity';
import { Permissions } from 'src/modules/permissions/entities/permissions.entity';

@Entity('roles')
export class Roles {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: false })
    rolName: string;

    @OneToMany(() => Permissions, permission => permission.rol)
    permissions: Permissions[];

    @OneToMany(() => Users, user => user.rol)
    users: Users[];
}