import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { File } from 'src/uploads/entities/file.entity';  
import { IAsset } from "../types/interface/Asset.interface";
import { Category } from 'src/category/Entities/category.entity';
import { Supplier } from 'src/supplier/Entities/Supplier.entity';
import { Location } from 'src/location/entities/location.entity';
import { LocationHistory } from 'src/location-history/entities/location-history.entity';
import { Status } from 'src/status/entities/status.entity';

@Entity('asset')
export class Asset implements IAsset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Category, (category) => category.assets, { nullable: true, eager: true, onDelete: "CASCADE" })
  category: Category;  

  @OneToMany(() => File, (file) => file.asset, { onDelete: "CASCADE", eager: true })
  files: File[]; 

  @ManyToOne(() => Supplier, (supplier) => supplier.assets, { nullable: true,eager: true,  onDelete: "CASCADE" })
  supplier: Supplier;  

  @ManyToOne(() => Location, (location) => location.assets, { nullable: false, eager: true, onDelete: "CASCADE" })
  location: Location;

  @OneToMany(() => LocationHistory, (history) => history.asset, { cascade: true })
  locationHistory: LocationHistory[];

  @ManyToOne(() => Status, { eager: true, nullable: false, onDelete: 'SET NULL' })
  status: Status;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
