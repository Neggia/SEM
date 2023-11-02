import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SemWebsite } from '../entities/sem_website.entity';

@Entity()
export class SemProcess {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  server: string;

  // Interval in seconds between two consequtive runs of the process, calculated between both starts
  @Column()
  interval: number;

  // Timestamp of last start
  @Column()
  last_run: number;

  @Column()
  last_duration: number;

  // Butmask
  @Column()
  status: number;

  @OneToMany(() => SemWebsite, (website) => website.process)
  websites: SemWebsite[];
}
