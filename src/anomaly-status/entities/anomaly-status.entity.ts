
import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Status } from 'src/status/entities/status.entity';
import { IAnomalyStatus } from '../types/interfaces/anomaly-status.interface';
import { Anomaly } from 'src/anomaly/Entities/anomaly.entity';
import { IAnomaly } from 'src/anomaly/types/interface/anomaly.interface';
import { Istatus } from 'src/status/types/interfaces/status.interface';
@Entity()
export class AnomalyStatus implements IAnomalyStatus{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Anomaly, (anomaly) => anomaly.statusHistory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'anomalyId' })
  anomaly: IAnomaly|string;

  @ManyToOne(() => Status, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'statusId' })
  status: Istatus|string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;


}
