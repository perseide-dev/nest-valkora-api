import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { Roles } from 'src/modules/roles/entities/roles.entity';

@Entity('permissions')
export class Permissions {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: false })
    permissionName: string;

    @Column({ unique: true, nullable: false })
    module: string;

    @ManyToOne(() => Roles, role => role.permissions, { nullable: false })
    @JoinColumn({ name: 'rol_id' })
    rol: Roles;
}