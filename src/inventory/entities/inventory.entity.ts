import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Iinventory } from '../types/interfaces/inventory.interface';
import { Status } from 'src/status/entities/status.entity';


@Entity()
export class Inventory implements Iinventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  launchDate: Date;

  @Column({ type: 'date', nullable: true })
  closingDate: Date | null; 
  
  @ManyToOne(() => Status, { eager: true }) 
  @JoinColumn({ name: 'statusId' })
  status: Status;
  
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;  
      
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
