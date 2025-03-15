import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { File } from 'src/uploads/entities/file.entity';  
import { IAsset } from "../types/interface/Asset.interface";
import { Category } from 'src/category/Entities/category.entity';


@Entity('asset')
export class Asset implements IAsset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
  
  @ManyToOne(() => Category, (category) => category.assets, { nullable: false, eager: true })  
  @JoinColumn({ name: 'categoryId' })  
  category: Category;
 
   @OneToMany(() => File, (file) => file.asset)
   files: File[];
   
  @Column({ nullable: true })
  imageUrl:string;

 

  
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
  

   
  /*@ManyToOne(() => Supplier, (supplier) => supplier.assets, { eager: true, nullable: true, onDelete: 'SET NULL' })
  supplier: Supplier | null;

   @ManyToOne(() => Place, (place) => place.assets, { eager: true, nullable: true, onDelete: 'SET NULL' })
   place: Place | null;*/

 
}
