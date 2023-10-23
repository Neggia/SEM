import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class SemProductJson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;
}
