
import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IAssetStatus } from '../types/interfaces/asset-status.interface';
import { Status } from 'src/status/entities/status.entity';
import { Asset } from 'src/assets/Entities/Asset.entity';
@Entity()
export class AssetStatus implements IAssetStatus{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Asset, { onDelete: 'CASCADE' })
  asset: Asset;

  @ManyToOne(() => Status, { eager: true, onDelete: 'CASCADE' })
  status: Status;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;


}
