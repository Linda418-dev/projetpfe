import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ISupplier } from "../types/interfaces/Supplier.interface";
import { Asset } from "src/assets/Entities/asset.entity";
import { IAsset } from "src/assets/types/interface/Asset.interface";

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
  assets: IAsset[]|string[];
  
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
