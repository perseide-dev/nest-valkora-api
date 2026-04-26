import { Entity } from "typeorm";

@Entity('assets')
export class Assets {
    @PrimaryGeneratedColumn()
    id: number;
}