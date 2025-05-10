
import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Status } from 'src/status/entities/status.entity';
import { IAnomalyStatus } from '../types/interfaces/anomaly-status.interface';
import { Anomaly } from 'src/anomaly/Entities/anomaly.entity';
@Entity()
export class AnomalyStatus implements IAnomalyStatus{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Anomaly, (anomaly) => anomaly.statusHistory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'anomalyId' })
  anomaly: Anomaly;

  @ManyToOne(() => Status, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'statusId' })
  status: Status;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;


}
