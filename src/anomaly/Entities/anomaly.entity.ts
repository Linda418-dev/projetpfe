import { Entity, PrimaryGeneratedColumn, Column,  CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { InventoryDetails } from 'src/inventory-details/entities/inventory-details.entity';
import { AnomalyStatus } from '../types/enums/anomaly-status.enum';
import { File } from 'src/uploads/entities/file.entity';


@Entity()
export class Anomaly {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: AnomalyStatus })
  status: AnomalyStatus;

  @OneToMany(() => File, (file) => file.anomaly)
  files: File[];

  
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
