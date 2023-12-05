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

  // Interval in hours between two consequtive runs of the process, calculated between both starts
  @Column()
  interval: number;

  // Timestamp of last start
  @Column({ nullable: true })
  last_start: number;

  // Timestamp of last end
  @Column({ nullable: true })
  last_end: number;

  // Bitmask
  @Column()
  status: number;

  @OneToMany(() => SemWebsite, (website) => website.process)
  websites: SemWebsite[];
}
