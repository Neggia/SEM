import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SemWebsite } from '../entities/sem_website.entity';

@Entity()
export class SemProcess {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  // interval in seconds between two consequtive runs of the process
  @Column()
  interval: number;

  @OneToMany(() => SemWebsite, (website) => website.process)
  websites: SemWebsite[];
}
