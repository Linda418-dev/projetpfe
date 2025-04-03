import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Iinventory } from '../types/interfaces/inventory.interface';
import { Status } from 'src/status/entities/status.entity';
import { User } from 'src/user/entities/user.entity';


@Entity()
export class Inventory implements Iinventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'date' })
  launchDate: Date;

  @Column({ type: 'date', nullable: true })
  closingDate: Date | null; 
  
  @ManyToOne(() => Status, { eager: true }) 
  @JoinColumn({ name: 'statusId' })
  status: Status;

  @ManyToMany(() => User, (user) => user.inventories)
  @JoinTable()
  users: User[];
  
  
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;  
      
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
