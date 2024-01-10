import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn } from 'typeorm';

export enum Status {
    DEFAULT,
    ACTIVE,
    INACTIVE,
}

@Entity()
export class Contact {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    phone_number: string;

    @Column({ nullable: true })
    comment: string;

    @Column({ default: Status.ACTIVE })
    status: number;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}