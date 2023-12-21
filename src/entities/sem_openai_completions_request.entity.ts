import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';
import { SemOpenaiCompletions } from '../entities/sem_openai_completions.entity';

@Entity()
export class SemOpenaiCompletionsRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  website_id: number;

  @Index()
  @Column()
  bodyHash: string;

  @Column({ nullable: true })
  body: string;

  @Column()
  response: string;

  // Bitmask
  @Column({ nullable: true })
  status: number;

  @ManyToOne(
    () => SemOpenaiCompletions,
    (openaiCompletions) => openaiCompletions.openaiCompletionsRequests,
  )
  openaiCompletions: SemOpenaiCompletions;
}
