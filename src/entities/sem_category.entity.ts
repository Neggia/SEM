import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
@Unique(['name'])
export class SemCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  parent_id: number;

  @Column()
  name: string;
}
