import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ICategory } from "../types/interface/category.interface";
import { Asset } from 'src/assets/Entities/asset.entity';
import { IAsset } from "src/assets/types/interface/Asset.interface";

@Entity()
export class Category implements ICategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Asset, (asset) => asset.category)
  assets: IAsset[]|string[];  

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
