import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IDepartment } from "../types/interface/department.interface";
import { Site } from "src/site/Entities/site.entity";
import { Service } from "src/service/entities/service.entity";
import { Isite } from "src/site/Types/interfaces/site.interface";
import { IService } from "src/service/types/interfaces/service.interface";


@Entity()
export class Department implements IDepartment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Site, (site) => site.departments, {  eager: true ,onDelete: 'CASCADE' })
  site: Isite|string;

  @OneToMany(() => Service, (service) => service.department)
  services: IService[]|string[];
  
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
