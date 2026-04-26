import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    Index,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';
import { Roles } from 'src/modules/roles/entities/roles.entity';
import { Users } from 'src/modules/users/entities/user.entity';
import { Modules } from 'src/common/enums/module.enum';
import { Focus } from 'src/common/enums/focus.enum';
import { Exclude } from 'class-transformer';
import { Unique } from 'typeorm';

@Entity('permissions')
@Unique(['rol', 'module'])
export class Permissions {
    @PrimaryGeneratedColumn()
    @Exclude()
    id: number;

    @Column({ type: 'uuid', unique: true, default: () => 'gen_random_uuid()' })
    @Index()
    uuid: string;

    @Column({ nullable: false })
    permissionName: string;


    @Column({ type: 'enum', enum: Modules, nullable: false })
    module: Modules;

    @Column({ type: 'enum', enum: Focus, default: Focus.SELF })
    focus: Focus;

    @Column({ default: true })
    create: boolean;

    @Column({ default: true })
    read: boolean;

    @Column({ default: true })
    update: boolean;

    @Column({ default: true })
    delete: boolean;

    @ManyToOne(() => Roles, role => role.permissions, { nullable: false })
    @JoinColumn({ name: 'rol_id' })
    rol: Roles;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => Users)
    @JoinColumn({ name: 'created_by_id' })
    createdBy: Users;

    @ManyToOne(() => Users)
    @JoinColumn({ name: 'updated_by_id' })
    updatedBy: Users;
}