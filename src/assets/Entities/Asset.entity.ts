import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne, Generated } from 'typeorm';
import { File } from 'src/uploads/entities/file.entity';  
import { IAsset } from "../types/interface/Asset.interface";
import { Category } from 'src/category/Entities/category.entity';
import { Supplier } from 'src/supplier/Entities/Supplier.entity';
import { Location } from 'src/location/entities/location.entity';
import { LocationHistory } from 'src/location-history/entities/location-history.entity';
import { Status } from 'src/status/entities/status.entity';
import { ICategory } from 'src/category/types/interface/category.interface';
import { ISupplier } from 'src/supplier/types/interfaces/Supplier.interface';
import { Ilocation } from 'src/location/types/interfaces/location.interface';
import { ILocationHistory } from 'src/location-history/types/interfaces/location-history.interface';
import { Istatus } from 'src/status/types/interfaces/status.interface';
import { IFile } from 'src/uploads/types/interfaces/file.interface';
import { IUser } from 'src/user/types/interface/user.interface';
import { User } from 'src/user/entities/user.entity';

@Entity('asset')
export class Asset implements IAsset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
  
  @Column({ nullable: true })
  qrCode: string;

   
 @Column({ unique: true })
 referenceNumber: string;


  @Column({ type: 'date', nullable: true })
  purchaseDate: Date | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  purchasePrice: number | null;

  @Column({ type: 'date', nullable: true })
  productionStartDate: Date | null;

  @ManyToOne(() => Category, (category) => category.assets, { nullable: true, eager: true, onDelete: "CASCADE" })
  category:ICategory|string;  

  @OneToMany(() => File, (file) => file.asset, { cascade: true, eager: true })
  files: IFile[]|string[]; 

  @ManyToOne(() => Supplier, (supplier) => supplier.assets, { nullable: true,eager: true,  onDelete: "CASCADE" })
  supplier: ISupplier|string;  

  @ManyToOne(() => Location, (location) => location.assets, { nullable: false, eager: true, onDelete: "CASCADE" })
  location: Ilocation|string;

  @OneToMany(() => LocationHistory, (history) => history.asset, { cascade: true })
  locationHistory: ILocationHistory[]|string[];

  @ManyToOne(() => Status, { eager: true, nullable: false, onDelete: 'SET NULL' })
  status: Istatus|string;

  @ManyToOne(() => User, { nullable: true, eager: true, onDelete: 'SET NULL' })
  employee?: IUser | string;

 
  
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date; 
}
