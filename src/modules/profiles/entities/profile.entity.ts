import { Entity, PrimaryGeneratedColumn, Column, Index, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { Exclude } from "class-transformer";
import { Lover } from "./lover.entity";
import { Assets } from "./assets.enttity";
import { ProfileInfo } from "./profileInfo.entity";
import { Users } from "src/modules/users/entities/user.entity";

@Entity('profiles')
export class Profile {
    @PrimaryGeneratedColumn()
    @Exclude()
    id: number;

    @Column({ type: 'uuid', unique: true, default: () => 'gen_random_uuid()' })
    @Index()
    uuid: string;

    @OneToOne(() => Assets, (assets) => assets.profile)
    @JoinColumn()
    assets: Assets;

    @OneToOne(() => Lover, (lover) => lover.profile)
    @JoinColumn()
    lover: Lover;

    @OneToOne(() => ProfileInfo, (profileInfo) => profileInfo.profile)
    @JoinColumn()
    profileInfo: ProfileInfo;
    
    @ManyToOne(() => Users, (user) => user.profiles, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: Users;

}