import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    ManyToOne,
    JoinColumn,
    OneToMany,
    ManyToMany,
    JoinTable
} from 'typeorm';
import { Exclude } from 'class-transformer'
import { Roles } from 'src/modules/roles/entities/roles.entity';
import { ControlGroup } from 'src/modules/control-groups/entities/control-group.entity';

@Entity('users')
export class Users {

    // id

    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number

    @Column({ type: 'uuid', unique: true, default: () => 'gen_random_uuid()' })
    @Index() // fast search
    uuid: string


    // user

    @Column({ unique: true })
    userName: string;

    @Column({ unique: true })
    accountName: string;

    @Column({ unique: true })
    email: string;

    @Column()
    @Exclude()
    password: string;


    // Security and Tokens

    @Column({ nullable: true })
    @Exclude()
    hashedRefreshToken?: string;

    // Audit

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: false })
    isAprove: boolean;

    @Column({ default: false })
    isOnline: boolean;

    // Audit FKs

    @ManyToOne(() => Users)
    @JoinColumn({ name: 'created_by_id' })
    createdBy: Users;


    @ManyToOne(() => Users)
    @JoinColumn({ name: 'updated_by_id' })
    updatedBy: Users;

    // FKs

    @ManyToOne(() => Roles, role => role.users, { nullable: false })
    @JoinColumn({ name: 'rol_id' })
    rol: Roles;

    @ManyToMany(() => ControlGroup, (cg) => cg.users)
    @JoinTable({ name: 'users_control_groups' })
    controlGroups: ControlGroup[];

    // @OneToMany(() => profiles, (profile) => profile.user)
    // profiles: Profiles[]

}