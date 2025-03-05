import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IAsset } from "../types/interface/Asset.interface";

@Entity()
export class Asset implements IAsset{
    @PrimaryGeneratedColumn('uuid')
    id: string; 
    
    @Column()
    name: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
      
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

}