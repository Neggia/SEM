import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
@Unique(["url"])
export class SemProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column("blob")
  thumbnail: Buffer;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  description_long: string;

  @Column()
  price_01: float;

  @Column()
  id_currency_01: bigint;

  @Column()
  price_02: float;

  @Column()
  id_currency_02: bigint;
}
}
