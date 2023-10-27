import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class SemOpenaiCompletions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  json: string;
}
