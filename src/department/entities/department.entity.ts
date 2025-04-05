import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IDepartment } from "../types/interface/department.interface";
import { Place } from "src/places/Entities/Place.entity";
import { Service } from "src/service/entities/service.entity";
import { User } from "src/user/entities/user.entity";


@Entity()
export class Department implements IDepartment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @ManyToOne(() => Place, (place) => place.departments, { nullable: false, onDelete: 'CASCADE' })
  place: Place;

  @Column()
  placeId: string;

  @OneToMany(() => Service, (service) => service.department, { cascade: true })
  services: Service[];

 
  
 
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
