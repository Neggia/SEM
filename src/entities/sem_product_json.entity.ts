import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class SemProductJSON {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  website_id: number;

  @Column()
  group_id: number;

  @Column()
  content: string;
}
