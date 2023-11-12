import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { SemOpenaiCompletions } from '../entities/sem_openai_completions.entity';

@Entity()
export class SemOpenaiCompletionsRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  website_id: number;

  @Column()
  bodyHash: string;

  @Column()
  response: string;

  @ManyToOne(
    () => SemOpenaiCompletions,
    (openaiCompletions) => openaiCompletions.openaiCompletionsRequests,
  )
  openaiCompletions: SemOpenaiCompletions;
}
