import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IinventoryStatus } from '../types/interfaces/inventory-status.interface';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { Status } from 'src/status/entities/status.entity';

@Entity()
export class InventoryStatus implements IinventoryStatus  {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Inventory, { eager: true, onDelete: 'CASCADE' })
  inventory: Inventory;

  @ManyToOne(() => Status, { eager: true, onDelete: 'CASCADE' })
  status: Status;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;  

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;  
}
