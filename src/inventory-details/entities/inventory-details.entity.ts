import { Affectation } from 'src/affectation/entities/affectation.entity';
import { File } from 'src/uploads/entities/file.entity';
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany, Column } from 'typeorm';
import { AssetStatus } from 'src/asset-status/entities/asset-status.entity';
import { LocationHistory } from 'src/location-history/entities/location-history.entity';
import { IInventoryDetails } from '../types/interfaces/inventory-details.interface';
import { Anomaly } from 'src/anomaly/Entities/anomaly.entity';

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
  affectation: Affectation;

  @ManyToOne(() => AssetStatus, { nullable: true, eager: true, onDelete: 'SET NULL' })
  assetStatus: AssetStatus;

  @ManyToOne(() => LocationHistory, { nullable: true, eager: true, onDelete: 'SET NULL' })
  locationHistory: LocationHistory;

  @OneToMany(() => File, (file) => file.inventoryDetails, {
    cascade: true,
    eager: true,
  })
  files: File[];

  @OneToMany(() => Anomaly, anomaly => anomaly.inventoryDetail, { cascade: true })
  anomalies: Anomaly[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

}
