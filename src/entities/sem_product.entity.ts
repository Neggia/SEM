import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  DeleteDateColumn,
  Index,
  ManyToOne,
} from 'typeorm';
import { SemWebsite } from '../entities/sem_website.entity';

@Entity()
@Unique(['url'])
export class SemProduct {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column()
  // html_element_id: number;

  @Column()
  url: string;

  @Column('blob', { nullable: true })
  thumbnail: Buffer;

  @Index() // Simple index on the 'title' column
  // @Index({ fulltext: true }) // Full-text index
  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  description_long: string;

  @Column()
  price_01: number;

  @Column()
  currency_01_id: number;

  @Column()
  price_02: number;

  // Details of currency are described in entity SemCurrency
  @Column()
  currency_02_id: number;

  @Column({ nullable: true })
  category_id: number;

  @Column()
  timestamp: number;

  // Soft delete, use the softRemove or softDelete method. To recover a soft-deleted entity, you can use the recover method.
  // Soft deleted entities are not included in query results. If you want to include them, you can use the withDeleted method.
  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => SemWebsite, (website) => website.products)
  website: SemWebsite;
}
