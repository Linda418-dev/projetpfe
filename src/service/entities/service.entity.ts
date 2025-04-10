import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IService } from "../types/interfaces/service.interface";
import { Department } from "src/department/entities/department.entity";
import { Location } from "src/location/entities/location.entity";


@Entity()
export class Service implements IService{
   
    @PrimaryGeneratedColumn('uuid')
    id: string;  

    @Column({ unique: true })
    name: string

    @ManyToOne(() => Department, (department) => department.services, { onDelete: 'CASCADE' })
    department: Department;
    
    @OneToMany(() => Location, (location) => location.service)
    locations: Location[];


    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;  
    
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
  
    
}