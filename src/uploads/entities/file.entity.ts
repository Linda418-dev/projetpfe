import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Asset } from 'src/assets/Entities/asset.entity';
import { IFile } from '../types/interfaces/file.interface';
import { InventoryDetails } from 'src/inventory-details/entities/inventory-details.entity';
import { Anomaly } from 'src/anomaly/Entities/anomaly.entity';


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
  asset: Asset ;
 

  @ManyToOne(() => InventoryDetails, (inventoryDetails) => inventoryDetails.files, {nullable: true, onDelete: 'CASCADE',})
  @JoinColumn({ name: 'inventoryDetailsId' })
  inventoryDetails: InventoryDetails;


  @ManyToOne(() => Anomaly, (anomaly) => anomaly.files, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'anomalyId' })
  anomaly: Anomaly;

  
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

