import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, ManyToMany, JoinColumn, ManyToOne, JoinTable } from 'typeorm';
import { Product } from './ProductModel';
import { User } from './UserModel';

@Entity()
export class WhishList {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @ManyToMany(() => Product)
    @JoinTable({ name: 'whishlist_products_id' })
    whishlist_products_id: Product[];

    @ManyToOne(() => User, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        nullable: true,
    })
    @JoinColumn({ name: 'userid', referencedColumnName: 'id' })
    userid: User;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}