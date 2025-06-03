import { Affectation } from 'src/affectation/entities/affectation.entity';
import { File } from 'src/uploads/entities/file.entity';
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { AssetStatus } from 'src/asset-status/entities/asset-status.entity';
import { LocationHistory } from 'src/location-history/entities/location-history.entity';
import { IInventoryDetails } from '../types/interfaces/inventory-details.interface';
import { Iaffectation } from 'src/affectation/types/interfaces/affectation.interface';
import { IAssetStatus } from 'src/asset-status/types/interfaces/asset-status.interface';
import { ILocationHistory } from 'src/location-history/types/interfaces/location-history.interface';
import { IFile } from 'src/uploads/types/interfaces/file.interface';

@Entity()
export class  InventoryDetails implements IInventoryDetails{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  scannedAt: Date;

  @ManyToOne(() => Affectation, (affectation) => affectation.inventoryDetails, {
    onDelete: 'CASCADE',
    eager: true,
  })
  affectation: Iaffectation|string;

  @ManyToOne(() => AssetStatus, { nullable: true, eager: true, onDelete: 'SET NULL' })
  assetStatus: IAssetStatus|string;

  @ManyToOne(() => LocationHistory, { nullable: true, eager: true, onDelete: 'SET NULL' })
  locationHistory: ILocationHistory|string;

  @OneToMany(() => File, (file) => file.inventoryDetails, {
    cascade: true,
    eager: true,
  })
  files: IFile[]|string[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

}
