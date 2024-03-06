import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { CurrencyPrice } from "./currencyPriceModel";

export enum Status {
  ACTIVE = 1,
  INACTIVE = 0,
}

@Entity()
export class Currencies {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column({ default: Status.ACTIVE })
  status: Status;

  @ManyToOne(() => CurrencyPrice, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "currencypriceid", referencedColumnName: "id" })
  currencypriceid: CurrencyPrice;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;
}
