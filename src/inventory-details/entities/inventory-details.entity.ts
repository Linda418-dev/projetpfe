import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { AssetStatus } from '../types/enums/inventory-details.enum';
import { Asset } from 'src/assets/Entities/Asset.entity';

@Entity('inventory_details')
export class InventoryDetails {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  scannedAt: Date;

  @Column({
    type: 'enum',
    enum: AssetStatus,
    default: AssetStatus.GOOD,
  })
  status: AssetStatus;

 



  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
