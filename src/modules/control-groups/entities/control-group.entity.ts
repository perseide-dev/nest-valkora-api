import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, Index } from 'typeorm';
import { Users } from 'src/modules/users/entities/user.entity';
import { Exclude } from 'class-transformer';

@Entity('control_groups')
export class ControlGroup {
    @PrimaryGeneratedColumn()
    @Exclude()
    id: number;

    @Column({ type: 'uuid', unique: true, default: () => 'gen_random_uuid()' })
    @Index()
    uuid: string;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    @ManyToMany(() => Users, (user) => user.controlGroups)
    users: Users[];
}
