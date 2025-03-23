import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IService } from "../types/interfaces/service.interface";
import { Department } from "src/department/entities/department.entity";
import { Asset } from "src/assets/Entities/Asset.entity";


@Entity()
export class Service implements IService{
   
    @PrimaryGeneratedColumn('uuid')
    id: string;  

    @Column()
    name: string;

    @Column()
    serviceLocation: string;
    
    @ManyToOne(() => Department, (department) => department.services, { nullable: false, onDelete: 'CASCADE' })
    department: Department;

    @Column()
    departmentId: string;

    @OneToMany(() => Asset, (asset) => asset.service, { cascade: true })
    assets: Asset[];

    

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;  
    
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
  
    
}