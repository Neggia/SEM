import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class SemUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;
}
