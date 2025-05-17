import { Entity, PrimaryGeneratedColumn, Column,  CreateDateColumn, UpdateDateColumn, OneToMany} from 'typeorm';
import { File } from 'src/uploads/entities/file.entity';
import { AnomalyStatus } from 'src/anomaly-status/entities/anomaly-status.entity';
import { IAnomalyStatus } from 'src/anomaly-status/types/interfaces/anomaly-status.interface';
import { IFile } from 'src/uploads/types/interfaces/file.interface';

@Entity()
export class Anomaly {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  assetId?: string;

  @OneToMany(() => AnomalyStatus, (anomalyStatus) => anomalyStatus.anomaly, { cascade: true })
  statusHistory: AnomalyStatus;

  @OneToMany(() => File, (file) => file.anomaly)
  files: IFile[]|string[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
