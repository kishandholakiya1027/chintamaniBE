import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class Otps {
    @PrimaryColumn({})
    id: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    otp: number;

    @Column({ type: 'bigint', nullable: true })
    expiresIn: number;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}