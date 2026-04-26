import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";
import { Exclude } from "class-transformer";

@Entity('profiles')
export class Profile {
    @PrimaryGeneratedColumn()
    @Exclude()
    id: number;

    @Column({ type: 'uuid', unique: true, default: () => 'gen_random_uuid()' })
    @Index()
    uuid: string;
}