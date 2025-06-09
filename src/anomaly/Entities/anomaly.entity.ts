import { Entity, PrimaryGeneratedColumn, Column,  CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne} from 'typeorm';
import { File } from 'src/uploads/entities/file.entity';
import { AnomalyStatus } from 'src/anomaly-status/entities/anomaly-status.entity';
import { IFile } from 'src/uploads/types/interfaces/file.interface';
import { IAnomaly } from '../types/interface/anomaly.interface';
import { User } from 'src/user/entities/user.entity';
import { IUser } from 'src/user/types/interface/user.interface';
import { IAnomalyStatus } from 'src/anomaly-status/types/interfaces/anomaly-status.interface';
import { IAsset } from 'src/assets/types/interface/Asset.interface';
import { Asset } from 'src/assets/Entities/asset.entity';

@Entity()
export class Anomaly implements IAnomaly{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @ManyToOne(() => Asset, { eager: true, nullable: false, onDelete: 'SET NULL' })
  asset: IAsset | string;

  @OneToMany(() => AnomalyStatus, (anomalyStatus) => anomalyStatus.anomaly, { cascade: true })
  statusHistory: IAnomalyStatus[];
  
  @ManyToOne(() => User, (user) => user.anomalies, { eager: true, onDelete: 'SET NULL', nullable: true })
  reportedBy: IUser|string;

  @OneToMany(() => File, (file) => file.anomaly)
  files: IFile[]|string[];

  @ManyToOne(() => User, { nullable: true, eager: true, onDelete: 'SET NULL' })
  assignedTo?: IUser | string;


  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
