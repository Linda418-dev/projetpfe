import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IPlace } from "../Types/interfaces/Place.interface";

@Entity()
export class Place implements IPlace{
   
    @PrimaryGeneratedColumn('uuid')
    id: string;  
   

    @Column()
    name: string;


    @Column()
    description: string;

    
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;  
    
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
  
    
}