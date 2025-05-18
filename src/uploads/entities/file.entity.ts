import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Asset } from 'src/assets/Entities/asset.entity';
import { IFile } from '../types/interfaces/file.interface';
import { InventoryDetails } from 'src/inventory-details/entities/inventory-details.entity';
import { Anomaly } from 'src/anomaly/Entities/anomaly.entity';
import { IAsset } from 'src/assets/types/interface/Asset.interface';
import { IInventoryDetails } from 'src/inventory-details/types/interfaces/inventory-details.interface';
import { IAnomaly } from 'src/anomaly/types/interface/anomaly.interface';


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
  asset: IAsset|string;
 
  @ManyToOne(() => InventoryDetails, (inventoryDetails) => inventoryDetails.files, {nullable: true, onDelete: 'CASCADE',})
  inventoryDetails: IInventoryDetails|string;

  @ManyToOne(() => Anomaly, (anomaly) => anomaly.files, { nullable: true, onDelete: 'CASCADE' })
  anomaly: IAnomaly|string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
  
}

