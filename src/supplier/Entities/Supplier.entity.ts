import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ISupplier } from "../types/interfaces/Supplier.interface";
import { Asset } from "src/assets/Entities/asset.entity";

@Entity()
export class Supplier implements ISupplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;  

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @OneToMany(() => Asset, (asset) => asset.supplier,{ cascade: true })
  assets: Asset[];
  
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
