import { Entity, PrimaryGeneratedColumn, Column,  CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { File } from 'src/uploads/entities/file.entity';
import { AnomalyStatus } from 'src/anomaly-status/entities/anomaly-status.entity';
import { InventoryDetails } from 'src/inventory-details/entities/inventory-details.entity';

@Entity()
export class Anomaly {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;


  @OneToMany(() => AnomalyStatus, (anomalyStatus) => anomalyStatus.anomaly, { cascade: true })
  statusHistory: AnomalyStatus[];

  @OneToMany(() => File, (file) => file.anomaly)
  files: File[];


  @ManyToOne(() => InventoryDetails, (details) => details.anomaly, {nullable: true,onDelete: 'SET NULL',eager: false,})
  @JoinColumn()
  inventoryDetails: InventoryDetails;
  

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
