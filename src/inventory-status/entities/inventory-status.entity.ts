import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { IinventoryStatus } from '../types/interfaces/inventory-status.interface';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { Status } from 'src/status/entities/status.entity';
import { Iinventory } from 'src/inventory/types/interfaces/inventory.interface';
import { Istatus } from 'src/status/types/interfaces/status.interface';

@Entity()
export class InventoryStatus implements IinventoryStatus  {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  

  @ManyToOne(() => Inventory, { eager: true, nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'inventoryId' })
  inventory: Iinventory|string;

  @ManyToOne(() => Status, { eager: true, onDelete: 'CASCADE' ,  nullable: false,})
  @JoinColumn({ name: 'statusId' })
  status: Istatus|string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;  

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;  
}
