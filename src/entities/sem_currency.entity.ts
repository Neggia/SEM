import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
@Unique(['name', 'ticker', 'symbol'])
export class SemCurrency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  ticker: string;

  @Column({ nullable: true })
  symbol: string;

  @Column({ nullable: true })
  type: number;

  @Column({ nullable: true })
  decimals: number;
}
