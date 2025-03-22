import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import {  IHistoryStatusAsset } from '../types/interfaces/history-status-asset.interface';
import { AssetStatus } from 'src/assets/types/enums/asset-status.enum';
import { Asset } from 'src/assets/Entities/Asset.entity';


@Entity('history_status_asset')
export class HistoryStatusAsset implements IHistoryStatusAsset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Asset, { nullable: false, onDelete: 'CASCADE' })
  asset: Asset;

  @Column()
  assetId: string;

  @Column({ type: 'enum', enum: AssetStatus })
  status: AssetStatus;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;  
      
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
