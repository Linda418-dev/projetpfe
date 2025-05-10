
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Istatus } from '../types/interfaces/status.interface';
@Entity()
export class Status implements Istatus{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type: 'asset' | 'inventory' | 'anomaly';

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;


}
