import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class SemWebsite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  url: string;

  @Column()
  process_id: number;

  @Column()
  last_run: string; //timestamp

  @Column()
  last_page: number;

  @Column()
  openai_completions_id: number;
}
