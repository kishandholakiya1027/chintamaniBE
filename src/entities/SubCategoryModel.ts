import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from './CategoryModel';

export enum SubCategoryStatus {
  ACTIVE,
  INACTIVE,
}

@Entity()
export class SubCategory {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ length: 50 })
  name: string;

  @ManyToOne(() => Category, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'categoryid', referencedColumnName: 'id' })
  categoryid: Category;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column({
    type: 'enum',
    enum: SubCategoryStatus,
    default: SubCategoryStatus.ACTIVE,
  })
  status: SubCategoryStatus;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
