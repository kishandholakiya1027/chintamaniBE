import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, JoinColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from './UserModel';
import { Product } from './ProductModel';

export enum Order_Status {
    Processing,
    Ongoing,
    Delivered
}

export enum payment_Status {
    Pendding,
    Processing,
    Complete
}

@Entity()
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @ManyToOne(() => User, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        nullable: true,
    })
    @JoinColumn({ name: 'userid', referencedColumnName: 'id' })
    userid: User;

    @ManyToMany(() => Product)
    @JoinTable({ name: 'order_item' })
    order_item: Product[];

    @Column({ type: 'bigint', nullable: true })
    totalprice: number;

    @Column({ nullable: true, default: Order_Status.Processing })
    orderstatus: number;

    @Column({ nullable: true })
    orderNote: string;

    @Column({ nullable: true })
    deliveredAt: Date

    @Column({ nullable: true, default: payment_Status.Pendding })
    payment: number;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}