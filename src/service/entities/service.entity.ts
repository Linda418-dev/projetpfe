import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IService } from "../types/interfaces/service.interface";
import { Department } from "src/department/entities/department.entity";
import { Location } from "src/location/entities/location.entity";
import { IDepartment } from "src/department/types/interface/department.interface";
import { Ilocation } from "src/location/types/interfaces/location.interface";


@Entity()
export class Service implements IService{
   
    @PrimaryGeneratedColumn('uuid')
    id: string;  

    @Column()
    name: string

    @ManyToOne(() => Department, (department) => department.services, { onDelete: 'CASCADE' })
    department: IDepartment|string;
    
    @OneToMany(() => Location, (location) => location.service)
    locations: Ilocation[]|string[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;  
    
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date; 
    
}