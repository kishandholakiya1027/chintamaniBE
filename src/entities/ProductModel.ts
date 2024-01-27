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

    @Column({ nullable: true, default: null })
    srno: string;

    @Column({ nullable: true, default: null })
    location: string;

    @Column({ nullable: true, default: null })
    stock: string;

    @Column({ nullable: true, default: null })
    stone: string;

    @Column({ nullable: true, default: null })
    title: string;

    @Column({ nullable: true, default: null })
    maintitle: string;

    @Column({ nullable: true, default: null })
    price: string;

    @Column({ nullable: true,default: null })
    rap: string;

    @Column({ nullable: true, default: null })
    rap_disccount: string;

    @Column({ nullable: true, default: null })
    per_ct: string;

    @Column({ nullable: true, default: null })
    disccount_price: string;

    @Column({ nullable: true, default: null })
    shape: string;

    @Column({ nullable: true, default: null })
    carat: string;

    @Column({ nullable: true, default: null })
    colour: string;

    @Column({ nullable: true, default: null })
    clarity: string;

    @Column({ nullable: true, default: null })
    cut: string;

    @Column({ nullable: true, default: null })
    polish: string;

    @Column({ nullable: true, default: null })
    symmetry: string;

    @Column({ nullable: true, default: null })
    flourescence: string;

    @Column({ nullable: true, default: null })
    flourescence_Color: string;

    @Column({ nullable: true, default: null })
    measurements: string;

    @Column({ nullable: true, default: null })
    cert_number: string;

    @Column({ nullable: true, default: null })
    table: string;

    @Column({ nullable: true, default: null })
    table_inclusion: string;

    @Column({ nullable: true, default: null })
    side_inclusion: string;

    @Column({ nullable: true, default: null })
    feather_inclusion : string;

    @Column({ nullable: true, default: null })
    tinge: string;

    @Column({ nullable: true, default: null })
    eyeclean : string;

    @Column({ nullable: true, default: null })
    girdle : string;

    @Column({ nullable: true, default: null })
    girdle_con : string;

    @Column({ nullable: true, default: null })
    girdle_per : string;

    @Column({ nullable: true, default: null })
    culet : string;

    @Column({ nullable: true, default: null })
    crown_height: string;

    @Column({ nullable: true, default: null })
    pavilian_depth: string;

    @Column({ nullable: true, default: null })
    depth: string;

    @Column({ nullable: true, default: null })
    report: string;

    @Column({ nullable: true, default: null })
    report_date: string;

    @Column({ nullable: true, default: null })
    laser_inscription: string;

    @Column({ nullable: true, default: null })
    lab: string;

    @Column({ nullable: true, default: null })
    star_length: string;

    @Column({ nullable: true, default: null })
    lower : string;

    @Column({ nullable: true, default: null })
    crown_angle: string;

    @Column({ nullable: true, default: null })
    pavilian_angle: string;

    @Column({ nullable: true, default: null })
    diamond_certificate: string;

    @Column({ nullable: true, default: null })
    productvideo: string;

    @Column({ nullable: true, default: null })
    disccount_percentage: string;

    @Column("text", { array: true, nullable: true })
    productimage: string[];

    @Column({ default: false }) 
    customized: boolean

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
