import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Service } from 'src/service/entities/service.entity';
import { IHistoryAsset } from '../types/interfaces/history-asset.interface';
import { Asset } from 'src/assets/Entities/Asset.entity';

@Entity('history_asset')
export class HistoryAsset implements IHistoryAsset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Asset, (asset) => asset.id, { onDelete: 'CASCADE' })
  asset: Asset;

  @ManyToOne(() => Service, (service) => service.id, { onDelete: 'CASCADE' })
  service: Service;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;  
      
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
