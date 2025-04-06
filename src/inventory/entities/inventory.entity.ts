import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Iinventory } from '../types/interfaces/inventory.interface';
import { Status } from 'src/status/entities/status.entity';
import { User } from 'src/user/entities/user.entity';
import { Place } from 'src/places/Entities/Place.entity';


@Entity()
export class Inventory implements Iinventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date | null; 
  
  @ManyToOne(() => Status, { eager: true }) 
  @JoinColumn({ name: 'statusId' })
  status: Status;

  @ManyToMany(() => User, (user) => user.inventories)
  @JoinTable()
  users: User[];
  

  @ManyToOne(() => Place, (place) => place.inventories)
  place: Place;
  

   // Ajout du champ JSONB pour les affectations opérateur - départements
   @Column({ type: 'jsonb', nullable: true })
   operatorAssignments: {
     userId: string;
     departmentIds: string[];
   }[];
   

   @Column({ type: 'simple-json', nullable: true })
   previousAssignments: {
   userId: string;
   departmentIds: string[];
}[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;  
      
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
