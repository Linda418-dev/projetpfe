import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Iinventory } from '../types/interfaces/inventory.interface';
import { Affectation } from 'src/affectation/entities/affectation.entity';
import { Site } from 'src/site/Entities/site.entity';
import { InventoryStatus } from 'src/inventory-status/entities/inventory-status.entity';
import { Iaffectation } from 'src/affectation/types/interfaces/affectation.interface';
import { Isite } from 'src/site/Types/interfaces/site.interface';
import { IinventoryStatus } from 'src/inventory-status/types/interfaces/inventory-status.interface';
import { Location } from 'src/location/entities/location.entity';

@Entity()
export class Inventory implements Iinventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date ; 

  @Column({ default: true })
  see: boolean;


  @OneToMany(() => Affectation, (affectation) => affectation.inventory)
  affectations: Iaffectation[]|string[];

  @ManyToOne(() => Site, { eager: true }) 
  site: Isite|string; 

  @OneToMany(() => InventoryStatus, (inventoryStatus) => inventoryStatus.inventory)
  inventoryStatus: IinventoryStatus[]|string[];

  @OneToMany(() => Location, (location) => location.inventory)
 locations: Location[] | string[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;  
      
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
