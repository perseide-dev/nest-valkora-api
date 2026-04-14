import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    ManyToOne,
    JoinColumn,
    OneToMany
} from 'typeorm';
import { Exclude } from 'class-transoformer'

@Entity('users')
export class Users {

    // id

    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number

    @Column({ type: 'uuid', unique: true, default: () => 'uuid_generate_v4()' })
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

    @Column({ unique: true, nullable: true })
    @Index()
    apiKey: string;

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

    @ManyToOne(() => Roles, roles => roles.users, { nullable: false })
    @JoinColumn({ name: 'rol_id' })
    rol: Roles;

    @OneToMany(() => profiles, (profile) => profile.user)
    profiles: Profiles[]

}