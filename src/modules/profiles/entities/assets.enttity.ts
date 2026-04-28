import { Entity, PrimaryGeneratedColumn, Column, Index, OneToOne } from "typeorm";
import { Exclude } from "class-transformer";
import { Profile } from "./profile.entity";

@Entity('assets')
export class Assets {
    @PrimaryGeneratedColumn()
    @Exclude()
    id: number;

    @Column({ type: 'uuid', unique: true, default: () => 'gen_random_uuid()' })
    @Index()
    uuid: string;

    @Column({ nullable: true })
    banner: string;

    @Column({ nullable: true })
    profile1: string;

    @Column({ nullable: true })
    profile2: string;

    @Column({ nullable: true })
    albumn: string;

    @Column({ nullable: true })
    song: string;

    @Column({ nullable: true })
    favorite: string;

    @OneToOne(() => Profile, (profile) => profile.assets)
    profile: Profile;
}