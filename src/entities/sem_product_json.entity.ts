import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { SemOpenaiCompletions } from '../entities/sem_openai_completions.entity';

@Entity()
export class SemProductJSON {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => SemOpenaiCompletions)
  @JoinColumn()
  openai_completions_id: number;

  @Column()
  website_id: number;

  @Column()
  group_id: number;

  @Column()
  content: string;
}
