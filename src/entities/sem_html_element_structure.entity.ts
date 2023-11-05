import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  // OneToOne,
  // JoinColumn,
  ManyToOne,
} from 'typeorm';
import { SemOpenaiCompletions } from './sem_openai_completions.entity';

// TODO rename to SemHtmlElementStructure
@Entity()
export class SemHtmlElementStructure {
  @PrimaryGeneratedColumn()
  id: number;

  // @OneToOne(() => SemOpenaiCompletions)
  // @JoinColumn()
  // openai_completions_id: number;

  @Column()
  website_id: number;

  @Column()
  group_id: number;

  // Pagination, product, category, ecc..
  @Column()
  type: number;

  @Column()
  json: string;

  @ManyToOne(
    () => SemOpenaiCompletions,
    (openaiCompletions) => openaiCompletions.htmlElementStructures,
  )
  openaiCompletions: SemOpenaiCompletions;
}
