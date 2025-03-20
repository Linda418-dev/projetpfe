import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IDepartment } from "../types/interface/department.interface";
import { Place } from "src/places/Entities/Place.entity";


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
 
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
