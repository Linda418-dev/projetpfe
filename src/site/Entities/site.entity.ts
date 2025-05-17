import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Isite } from "../Types/interfaces/site.interface";
import { Department } from "src/department/entities/department.entity";
import { IDepartment } from "src/department/types/interface/department.interface";

@Entity()
export class Site implements Isite{
    @PrimaryGeneratedColumn('uuid')
    id: string;  
  
    @Column({ unique: true })
    name: string;
   
    @OneToMany(() => Department, (department) => department.site)
    departments: IDepartment[]|string[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;  
    
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
     
}