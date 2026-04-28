import { Entity, PrimaryGeneratedColumn, Column, Index, OneToOne } from "typeorm";
import { Exclude } from "class-transformer";
import { Profile } from "./profile.entity";

@Entity('profileInfo')
export class ProfileInfo {
    @PrimaryGeneratedColumn()
    @Exclude()
    id: number;

    @Column({ type: 'uuid', unique: true, default: () => 'gen_random_uuid()' })
    @Index()
    uuid: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    phrase: string

    @Column()
    nationality: string

    @Column({ nullable: true })
    job: string

    @Column()
    race: string

    @OneToOne(() => Profile, (profile) => profile.profileInfo)
    profile: Profile;

}