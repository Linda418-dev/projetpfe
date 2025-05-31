import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Isite } from "../Types/interfaces/site.interface";
import { Department } from "src/department/entities/department.entity";
import { IDepartment } from "src/department/types/interface/department.interface";
import { Category } from "src/category/Entities/category.entity";
import { ICategory } from "src/category/types/interface/category.interface";
import { Supplier } from "src/supplier/Entities/Supplier.entity";
import { ISupplier } from "src/supplier/types/interfaces/Supplier.interface";
import { User } from "src/user/entities/user.entity";
import { IUser } from "src/user/types/interface/user.interface";

@Entity()
export class Site implements Isite{
    @PrimaryGeneratedColumn('uuid')
    id: string;  
  
    @Column({ unique: true })
    name: string;
   
    @OneToMany(() => Department, (department) => department.site)
    departments: IDepartment[]|string[];

    @OneToMany(() => Category, (category) => category.site)
    categories: ICategory[] | string[];

    @OneToMany(() => Supplier, (supplier) => supplier.site)
    suppliers: ISupplier[] | string[];

    @OneToMany(() => User, (user) => user.site)
    users: IUser[] | string[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;  
    
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
     
}