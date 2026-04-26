import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Index,
    OneToMany
} from 'typeorm';
import { Users } from 'src/modules/users/entities/user.entity';
import { Permissions } from 'src/modules/permissions/entities/permissions.entity';
import { Exclude } from 'class-transformer';

@Entity('roles')
export class Roles {
    @PrimaryGeneratedColumn()
    @Exclude()
    id: number;

    @Column({ type: 'uuid', unique: true, default: () => 'gen_random_uuid()' })
    @Index()
    uuid: string;

    @Column({ unique: true, nullable: false })
    rolName: string;

    @OneToMany(() => Permissions, permission => permission.rol)
    permissions: Permissions[];

    @OneToMany(() => Users, user => user.rol)
    users: Users[];
}