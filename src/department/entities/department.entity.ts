import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IDepartment } from "../types/interface/department.interface";
import { Site } from "src/site/Entities/site.entity";
import { Service } from "src/service/entities/service.entity";


@Entity()
export class Department implements IDepartment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @ManyToOne(() => Site, (site) => site.departments, { onDelete: 'CASCADE' })
  site: Site;

  @OneToMany(() => Service, (service) => service.department)
  services: Service[];
  
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
