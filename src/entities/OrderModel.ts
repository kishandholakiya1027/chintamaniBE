import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Product } from "./ProductModel";
import { User } from "./UserModel";

export enum Order_Status {
  Processing,
  Ongoing,
  Delivered,
}

export enum payment_Status {
  Pendding,
  Processing,
  Complete,
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @ManyToOne(() => User, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "userid", referencedColumnName: "id" })
  userid: User;

  @ManyToMany(() => Product)
  @JoinTable({ name: "order_item" })
  order_item: Product[];

  @Column({ type: "simple-array", default: [] })
  quantity: number[];

  @Column({ nullable: true })
  totalprice: string;

  @Column({ nullable: true, default: Order_Status.Ongoing })
  orderstatus: number;

  @Column({ nullable: true })
  orderNote: string;

  @Column({ nullable: true })
  deliveredAt: Date;

  @Column({ nullable: true })
  Address: string;

  @Column({ nullable: true })
  mobile: string;

  @Column({ nullable: true })
  currency: string;

  @Column({ nullable: true, default: payment_Status.Pendding })
  payment: number;

  @Column({ type: "json", nullable: true })
  orderDetails: Record<string, any>;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;
}
