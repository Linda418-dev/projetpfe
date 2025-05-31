import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ICategory } from "../types/interface/category.interface";
import { Asset } from 'src/assets/Entities/asset.entity';
import { IAsset } from "src/assets/types/interface/Asset.interface";
import { Site } from "src/site/Entities/site.entity";
import { Isite } from "src/site/Types/interfaces/site.interface";

@Entity()
export class Category implements ICategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Asset, (asset) => asset.category)
  assets: IAsset[]|string[];  

  @ManyToOne(() => Site, (site) => site.categories, { nullable: false, onDelete: 'CASCADE' })
  site: Isite | string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
