import { Entity, PrimaryGeneratedColumn, Column,  CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { InventoryDetails } from 'src/inventory-details/entities/inventory-details.entity';
import { AnomalyStatus } from '../types/enums/anomaly-status.enum';


@Entity()
export class Anomaly {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: AnomalyStatus ,  default: AnomalyStatus.PENDING})
  status: AnomalyStatus;

  @ManyToOne(() => InventoryDetails, inventoryDetail => inventoryDetail.anomalies, { onDelete: 'CASCADE' })
  inventoryDetail: InventoryDetails;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
