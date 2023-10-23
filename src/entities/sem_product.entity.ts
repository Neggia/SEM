import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class SemProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;
}
