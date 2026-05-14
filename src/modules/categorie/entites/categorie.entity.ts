import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne } from "typeorm";
import { Exclude } from "class-transformer";
import { Users } from "src/modules/users/entities/user.entity";

@Entity()
export class Categorie {
    @PrimaryGeneratedColumn()
    @Exclude()
    id: number;

    @Column({ type: 'uuid', unique: true, default: () => 'gen_random_uuid()' })
    @Index()
    uuid: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    description: string;

    // aduit

    @ManyToOne(() => Users, { nullable: false })
    @JoinColumn({ name: 'created_by_id' })
    createdBy: Users;

    @ManyToOne(() => Users, { nullable: false })
    @JoinColumn({ name: 'updated_by_id' })
    updatedBy: Users;


    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;


}