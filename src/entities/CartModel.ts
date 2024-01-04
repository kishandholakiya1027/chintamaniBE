import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, ManyToMany, JoinColumn, ManyToOne, JoinTable } from 'typeorm';
import { Product } from './ProductModel';
import { User } from './UserModel';

@Entity()
export class Cart {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @ManyToMany(() => Product)
    @JoinTable({ name: 'products_id' })
    products_id: Product[];

    @ManyToOne(() => User, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        nullable: true,
    })
    @JoinColumn({ name: 'userid', referencedColumnName: 'id' })
    userid: User;

    @Column({ type: 'simple-array', default: [] }) 
    quantity: number[];

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}