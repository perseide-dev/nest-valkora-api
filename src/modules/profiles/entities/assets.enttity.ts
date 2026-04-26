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

    @Column()
    banner: string;

    @Column()
    profile1: string;

    @Column()
    profile2: string;

    @Column()
    albumn: string;

    @Column()
    song: string;

    @Column()
    favorite: string;

    @OneToOne(() => Profile, (profile) => profile.assets)
    profile: Profile;
}