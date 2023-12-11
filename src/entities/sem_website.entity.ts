import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  // OneToOne,
  // JoinColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { SemProcess } from '../entities/sem_process.entity';
import { SemHtmlElement } from '../entities/sem_html_element.entity';
import { SemProduct } from '../entities/sem_product.entity';
import { SemHtmlElementStructure } from './sem_html_element_structure.entity';

@Entity()
export class SemWebsite {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  url: string;

  // @OneToOne(() => SemProcess)
  // @JoinColumn()
  // process_id: number

  // Timestamp of last start
  @Column()
  last_start: number;

  @Column()
  last_page: number;

  @Column()
  num_pages: number;

  // Butmask
  @Column()
  status: number;

  // @Column()
  // openai_completions_id: number;

  @ManyToOne(() => SemProcess, (process) => process.websites)
  process: SemProcess;

  @OneToMany(() => SemHtmlElement, (htmlElement) => htmlElement.website, {
    cascade: true,
  })
  htmlElements: SemHtmlElement[];

  @OneToMany(() => SemProduct, (product) => product.website, { cascade: true })
  products: SemProduct[];

  @OneToMany(
    () => SemHtmlElementStructure,
    (htmlElementStructure) => htmlElementStructure.website,
    { cascade: true },
  )
  htmlElementStructures: SemHtmlElementStructure[];
}
