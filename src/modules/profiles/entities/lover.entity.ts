import { Entity, PrimaryGeneratedColumn, Column, Index, OneToOne } from "typeorm";
import { Exclude } from "class-transformer";
import { Profile } from "./profile.entity";

@Entity('lovers')
export class Lover {
    @PrimaryGeneratedColumn()
    @Exclude()
    id: number;

    @Column({ type: 'uuid', unique: true, default: () => 'gen_random_uuid()' })
    @Index()
    uuid: string;

    @Column({ nullable: true })
    profileImg: string;

    @Column({ nullable: true })
    coverImg: string;

    @Column({ type: 'uuid', nullable: true })
    partnerUuid: string;

    @OneToOne(() => Profile, (profile) => profile.lover)
    profile: Profile;

}