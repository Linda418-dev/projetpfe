import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IinventoryHistoryStatus } from '../types/interfaces/inventory-status-history.interface';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { Status } from 'src/status/entities/status.entity';

@Entity()
export class InventoryStatusHistory implements IinventoryHistoryStatus  {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Inventory, { onDelete: 'CASCADE' })
  inventory: Inventory;

  @ManyToOne(() => Status, { eager: true })
  status: Status;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;  

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;  
}
