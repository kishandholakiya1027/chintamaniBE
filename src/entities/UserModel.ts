import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, IsNull } from 'typeorm';

export enum UserRole {
  Admin = 1,
  Moderator = 2,
  User = 3,
}

export enum Status {
  ACTIVE,
  INACTIVE,
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ length: 50 })
  firstname: string;

  @Column({ length: 50 })
  lastname: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  mobile: string;

  @Column({ nullable: true })
  password: string;

  @Column({ default: Status.ACTIVE })
  status: number;

  @Column({ default: UserRole.User })
  role: UserRole;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}

export interface IUser {
  id: string; // Assuming you're using uuid for id
  firstname: string;
  lastname: string;
  email?: string | null;
  mobile?: string | null;
  password?: string | null;
  status?: number;
  role: number;
  accessToken: string | null;
  createdAt: Date;
  updatedAt: Date;
}