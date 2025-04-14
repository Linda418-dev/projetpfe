import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Asset } from 'src/assets/Entities/Asset.entity';
import { IFile } from '../types/interfaces/file.interface';


@Entity('file')
export class File implements IFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  urlFile: string;

  @Column()
  typeFile: string;

  @ManyToOne(() => Asset, (asset) => asset.files, { nullable: true,onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assetId' })
  asset: Asset;

  @Column({ nullable: true })  
  assetId: string;  

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

