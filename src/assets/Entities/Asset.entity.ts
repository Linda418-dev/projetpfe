import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { File } from 'src/uploads/entities/file.entity';  
import { IAsset } from "../types/interface/Asset.interface";
import { Category } from 'src/category/Entities/category.entity';

@Entity('asset')
export class Asset implements IAsset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()  
  categoryName: string; 

  @ManyToOne(() => Category, (category) => category.assets, { nullable: false, eager: true , onDelete: "CASCADE" })  
  category: Category;

  @OneToMany(() => File, (file) => file.asset)
  files: File[];

  @Column({ nullable: true })
  imageUrl: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
