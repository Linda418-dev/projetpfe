
import {  CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Iaffectation } from '../types/interfaces/affectation.interface';
import { User } from 'src/user/entities/user.entity';
import { InventoryDetails } from 'src/inventory-details/entities/inventory-details.entity';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { IUser } from 'src/user/types/interface/user.interface';
import { Iinventory } from 'src/inventory/types/interfaces/inventory.interface';

@Entity()
export class Affectation implements Iaffectation{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Inventory, { onDelete: 'CASCADE' })
  inventory: Iinventory|string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })!
  operator: IUser|string;

  @OneToMany(() => InventoryDetails, (details) => details.affectation)
  inventoryDetails: InventoryDetails[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;


}
