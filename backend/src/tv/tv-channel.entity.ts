import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class TvChannel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: '卫视' })
  category: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ type: 'text' })
  stream: string;

  @Column({ nullable: true })
  website: string;

  @Column({ default: 0 })
  sortOrder: number;
}
