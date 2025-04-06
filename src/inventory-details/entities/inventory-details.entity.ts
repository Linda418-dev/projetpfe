import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { AssetStatus } from '../types/enums/inventory-details.enum';
import { Asset } from 'src/assets/Entities/Asset.entity';
import { Place } from 'src/places/Entities/Place.entity';

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

  @ManyToOne(() => Inventory, (inventory) => inventory.details)
  @JoinColumn({ name: 'inventory_id' })
  inventory: Inventory;

  @ManyToOne(() => Asset, (asset) => asset.inventoryDetails)
  @JoinColumn({ name: 'asset_id' })
  asset: Asset;

  @ManyToOne(() => Place, (place) => place.inventoryDetails)
  @JoinColumn({ name: 'place_id' })
  place: Place;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
