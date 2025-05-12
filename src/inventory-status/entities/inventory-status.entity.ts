import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { IinventoryStatus } from '../types/interfaces/inventory-status.interface';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { Status } from 'src/status/entities/status.entity';

@Entity()
export class InventoryStatus implements IinventoryStatus  {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  

  @ManyToOne(() => Inventory, { eager: true, nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'inventoryId' })
  inventory: Inventory;

  @ManyToOne(() => Status, { eager: true, onDelete: 'CASCADE' ,  nullable: false,})
  @JoinColumn({ name: 'statusId' })
  status: Status;

  

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;  

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;  
}
