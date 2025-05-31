import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ISupplier } from "../types/interfaces/Supplier.interface";
import { Asset } from "src/assets/Entities/asset.entity";
import { IAsset } from "src/assets/types/interface/Asset.interface";
import { Site } from "src/site/Entities/site.entity";
import { Isite } from "src/site/Types/interfaces/site.interface";

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
  
  @ManyToOne(() => Site, (site) => site.suppliers, { onDelete: 'CASCADE' })
  site: Isite | string; 
  
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
