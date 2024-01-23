import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, JoinColumn, ManyToOne } from 'typeorm';
import { SubCategory } from './SubCategoryModel';
import { InnerCategory } from './InnerCategoryModel';
import { Category } from './CategoryModel';

export enum ProductStatus {
    ACTIVE,
    INACTIVE,
}

@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: number;

    @Column({ nullable: true })
    title: string;

    @Column({ nullable: true })
    maintitle: string;

    @Column({ nullable: true })
    price: string;

    @Column({ nullable: true, default: null })
    disccount_price: string;

    @Column({ nullable: true })
    shape: string;

    @Column({ nullable: true })
    carat: string;

    @Column({ nullable: true })
    colour: string;

    @Column({ nullable: true })
    clarity: string;

    @Column({ nullable: true })
    cut: string;

    @Column({ nullable: true })
    polish: string;

    @Column({ nullable: true })
    symmetry: string;

    @Column({ nullable: true })
    flourescence: string;

    @Column({ nullable: true })
    measurements: string;

    @Column({ nullable: true })
    cert_number: string;

    @Column({ nullable: true })
    table: string;

    @Column({ nullable: true })
    crown_height: string;

    @Column({ nullable: true })
    pavilian_depth: string;

    @Column({ nullable: true })
    depth: string;

    @Column({ nullable: true })
    crown_angle: string;

    @Column({ nullable: true })
    pavilian_angle: string;

    @Column({ nullable: true })
    diamond_certificate: string;

    @Column({ nullable: true, default: null })
    disccount_percentage: string;

    @Column("text", { array: true, nullable: true })
    productimage: string[];

    @Column({
        type: 'enum',
        enum: ProductStatus,
        default: ProductStatus.ACTIVE,
        nullable: true
    })
    status: ProductStatus;

    @Column({ type: 'jsonb', nullable: true })
    diamond_size: {
        size: string;
        size_desc: string;
        sizeimages: string;
    };

    @Column({ type: 'jsonb', nullable: true })
    diamond_color: {
        color_desc: string;
        colorimage: string;
    };

    @Column({ type: 'jsonb', nullable: true })
    diamond_clarity: {
        clarity_desc: string;
        clarityimage: string;
    };

    @Column({ type: 'jsonb', nullable: true })
    diamond_cut: {
        cut_desc: string;
        cutimage: string;
    };

    @ManyToOne(() => SubCategory, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        nullable: true,
    })
    @JoinColumn({ name: 'subcategoryid', referencedColumnName: 'id' })
    subcategoryid: SubCategory;

    @ManyToOne(() => Category, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        nullable: true,
    })
    @JoinColumn({ name: 'categoryid', referencedColumnName: 'id' })
    categoryid: Category;

    @ManyToOne(() => InnerCategory, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        nullable: true,
    })
    @JoinColumn({ name: 'innercategoryid', referencedColumnName: 'id' })
    innercategoryid: InnerCategory;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}

export interface IProduct {
    id: any,
    maintitle: string,
    title: string,
    price: string,
    disccount_price: string,
    shape: string,
    carat: string,
    colour: string,
    clarity: string,
    cut: string,
    polish: string,
    symmetry: string,
    flourescence: string,
    measurements: string,
    cert_number: string,
    table: string,
    crown_height: string,
    pavilian_depth: string,
    depth: string,
    crown_angle: string,
    pavilian_angle: string,
    status: number,
    diamond_size: {
        size: string,
        size_desc: string,
        sizeimages: string
    }
    diamond_color: {
        color_desc: string;
        colorimage: string;
    }
    diamond_clarity: {
        clarity_desc: string;
        clarityimage: string;
    }
    diamond_cut: {
        cut_desc: string;
        cutimage: string;
    }
    subcategoryid: any,
    innercategoryid: any,
}
