import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class SemHtmlElement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;
}
