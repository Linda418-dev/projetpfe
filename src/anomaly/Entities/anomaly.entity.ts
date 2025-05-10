import { Entity, PrimaryGeneratedColumn, Column,  CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { File } from 'src/uploads/entities/file.entity';
import { AnomalyStatus } from 'src/anomaly-status/entities/anomaly-status.entity';

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

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
