import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IPlace } from "../Types/interfaces/Place.interface";
import { Department } from "src/department/entities/department.entity";
import { Inventory } from "src/inventory/entities/inventory.entity";
import { InventoryDetails } from "src/inventory-details/entities/inventory-details.entity";

@Entity()
export class Place implements IPlace{
   
    @PrimaryGeneratedColumn('uuid')
    id: string;  
  
    @Column()
    name: string;

    @Column()
    description: string;
  

    @OneToMany(() => Department, (department) => department.place)
    departments: Department[];

    @OneToMany(() => Inventory, (inventory) => inventory.place)
    inventories: Inventory[];

    @OneToMany(() => InventoryDetails, (details) => details.place)
    inventoryDetails: InventoryDetails[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;  
    
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
  
    
}