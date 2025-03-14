import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ISupplier } from "../types/interfaces/Supplier.interface";
import { Asset } from "src/assets/Entities/Asset.entity";

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

    @OneToMany(() => Asset, (asset) => asset.supplier)
    assets: Asset[];
    
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;  
    
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
  
    
}