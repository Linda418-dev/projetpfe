import { File } from 'src/uploads/entities/file.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { IAsset } from '../types/interface/Asset.interface';
import { Category } from 'src/category/Entities/category.entity';



@Entity('asset')
export class Asset implements IAsset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Category, (category) => category.assets, { eager: true, onDelete: 'SET NULL' })
  category: Category | null;

  @OneToMany(() => File, (file) => file.asset)
  files: File[];

  @Column({ nullable: true })
  imageUrl: string;


  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;


}
