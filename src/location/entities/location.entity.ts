import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Ilocation } from "../types/interfaces/location.interface";
import { Service } from "src/service/entities/service.entity";
import { Asset } from "src/assets/Entities/asset.entity";
import { LocationHistory } from "src/location-history/entities/location-history.entity";

@Entity()
export class Location implements Ilocation{
   
    @PrimaryGeneratedColumn('uuid')
    id: string;  

    @Column({ unique: true })
    name: string;
    
    @ManyToOne(() => Service, (service) => service.locations, { onDelete: 'CASCADE' })
    service: Service;

    @OneToMany(() => Asset, (asset) => asset.location)
    assets: Asset[];

    @OneToMany(() => LocationHistory, (history) => history.location)
    locationHistory: LocationHistory[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;  
    
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
  
    
}