import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class SemHtmlElement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  website_id: number;

  @Column()
  group_id: number;

  @Column()
  content: string;
}
