import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { SemProcess } from '../entities/sem_process.entity';
import { SemHtmlElement } from '../entities/sem_html_element.entity';

@Entity()
export class SemWebsite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  url: string;

  @OneToOne(() => SemProcess)
  @JoinColumn()
  process_id: number;

  @Column()
  last_run: string; //timestamp

  @Column()
  last_page: number;

  // @Column()
  // openai_completions_id: number;

  @OneToMany(() => SemHtmlElement, (htmlElement) => htmlElement.website)
  htmlElements: SemHtmlElement[];
}
