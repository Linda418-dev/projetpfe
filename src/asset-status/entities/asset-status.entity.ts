
import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IAssetStatus } from '../types/interfaces/asset-status.interface';
import { Status } from 'src/status/entities/status.entity';
import { Asset } from 'src/assets/Entities/asset.entity';
import { IAsset } from 'src/assets/types/interface/Asset.interface';
import { Istatus } from 'src/status/types/interfaces/status.interface';
@Entity()
export class AssetStatus implements IAssetStatus{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Asset, { onDelete: 'CASCADE' })
  asset: IAsset|string;

  @ManyToOne(() => Status, { eager: true, onDelete: 'CASCADE' })
  status: Istatus|string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;


}
