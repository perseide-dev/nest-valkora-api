import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Users } from 'src/modules/users/entities/user.entity';

@Entity('control_groups')
export class ControlGroup {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    @ManyToMany(() => Users, (user) => user.controlGroups)
    users: Users[];
}
