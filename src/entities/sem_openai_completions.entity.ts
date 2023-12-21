import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SemHtmlElementStructure } from './sem_html_element_structure.entity';
import { SemOpenaiCompletionsRequest } from '../entities/sem_openai_completions_request.entity';

@Entity()
export class SemOpenaiCompletions {
  @PrimaryGeneratedColumn()
  id: number;

  // Must match ServiceOpenaiService function name
  @Column()
  function_name: string;

  // If null, valid for all websites, set to force a particular completitions on a website
  @Column({ nullable: true })
  website_id: number;

  // If null, valid for all htmlElements of website, set to force a particular completitions on a group of htmlElements of a website
  @Column({ nullable: true })
  group_id: number;

  @Column()
  body: string;

  // @Column()
  // parameters: string;

  @OneToMany(
    () => SemHtmlElementStructure,
    (htmlElementStructure) => htmlElementStructure.openaiCompletions,
  )
  htmlElementStructures: SemHtmlElementStructure[];

  @OneToMany(
    () => SemOpenaiCompletionsRequest,
    (openaiCompletionsRequest) => openaiCompletionsRequest.openaiCompletions,
  )
  openaiCompletionsRequests: SemOpenaiCompletionsRequest[];
}
