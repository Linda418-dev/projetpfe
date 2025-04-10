import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Ilocation } from "../types/interfaces/location.interface";
import { Service } from "src/service/entities/service.entity";


@Entity()
export class Location implements Ilocation{
   
    @PrimaryGeneratedColumn('uuid')
    id: string;  

    @Column({ unique: true })
    name: string;
    
    @ManyToOne(() => Service, (service) => service.locations, { onDelete: 'CASCADE' })
    service: Service;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;  
    
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
  
    
}