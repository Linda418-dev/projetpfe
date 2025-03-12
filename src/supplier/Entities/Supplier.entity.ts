import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ISupplier } from "../types/interfaces/Supplier.interface";

@Entity()
export class Supplier  implements ISupplier{   
    @PrimaryGeneratedColumn('uuid')
    id: string;  
   
    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    phone : string;
    
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;  
    
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
  
    
}