import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Ilocation } from "../types/interfaces/location.interface";
import { Service } from "src/service/entities/service.entity";
import { Asset } from "src/assets/Entities/asset.entity";
import { LocationHistory } from "src/location-history/entities/location-history.entity";
import { IService } from "src/service/types/interfaces/service.interface";
import { IAsset } from "src/assets/types/interface/Asset.interface";
import { ILocationHistory } from "src/location-history/types/interfaces/location-history.interface";

@Entity()
export class Location implements Ilocation{
   
    @PrimaryGeneratedColumn('uuid')
    id: string;  

    @Column()
    name: string;
    
    @ManyToOne(() => Service, (service) => service.locations, { eager: true , onDelete: 'CASCADE' })
    service: IService|string;

    @OneToMany(() => Asset, (asset) => asset.location)
    assets: IAsset[]|string[];

    @OneToMany(() => LocationHistory, (history) => history.location)
    locationHistory: ILocationHistory[]|LocationHistory[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;  
    
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
  
    
}