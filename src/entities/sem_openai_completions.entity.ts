import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
