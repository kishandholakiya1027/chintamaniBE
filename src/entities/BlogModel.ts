import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './UserModel';
export enum Status {
  ACTIVE,
  INACTIVE,
}
@Entity()
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ nullable: true })
  heading: string;

  @Column({ nullable: true })
  title: string;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'author', referencedColumnName: 'id' })
  author: User;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string

  @Column({ default: Status.INACTIVE })
  status: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
