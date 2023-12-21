import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { SemWebsite } from '../entities/sem_website.entity';

@Entity()
export class SemHtmlElement {
  @PrimaryGeneratedColumn()
  id: number;

  // Elements with the same structure have the same group_id and are parsed just once
  @Column()
  group_id: number;

  @Column()
  selector: string;

  @Column()
  content: string;

  // Get type from entity associated, for example an existing SemProductJSON record for same website_id/group_id
  // @Column()
  // type: number;

  @ManyToOne(() => SemWebsite, (website) => website.htmlElements)
  website: SemWebsite;
}
