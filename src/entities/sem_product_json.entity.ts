import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class SemProductJSON {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;
}
