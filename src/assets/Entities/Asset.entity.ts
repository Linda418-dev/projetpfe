import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { File } from 'src/uploads/entities/file.entity';  
import { IAsset } from "../types/interface/Asset.interface";
import { Category } from 'src/category/Entities/category.entity';
import { Supplier } from 'src/supplier/Entities/Supplier.entity';
import { Place } from 'src/places/Entities/Place.entity';
import { Service } from 'src/service/entities/service.entity';
import { AssetStatus } from '../types/enums/asset-status.enum';

@Entity('asset')
export class Asset implements IAsset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()  
  categoryName: string;  

  @ManyToOne(() => Category, (category) => category.assets, { nullable: true, eager: true, onDelete: "CASCADE" })
  category: Category;  

  @OneToMany(() => File, (file) => file.asset, { onDelete: "CASCADE" })
  files: File[]; 

  @ManyToOne(() => Supplier, (supplier) => supplier.assets, { nullable: true, onDelete: "CASCADE" })
  supplier: Supplier;  

  @Column({ nullable: true })
  supplierName: string; 

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: AssetStatus.GOOD_CONDITION })
  status: AssetStatus;
  
  @ManyToOne(() => Service, (service) => service.assets, { nullable: false, onDelete: "CASCADE" })
  service: Service;

  @Column()
  serviceId: string;


  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
