import { CreateDateColumn, Entity, ManyToOne,  PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ILocationHistory } from '../types/interfaces/location-history.interface';
import { Asset } from 'src/assets/Entities/asset.entity';
import { Location } from 'src/location/entities/location.entity';
import { Ilocation } from 'src/location/types/interfaces/location.interface';
import { IAsset } from 'src/assets/types/interface/Asset.interface';

@Entity()
export class LocationHistory implements ILocationHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Asset, (asset) => asset.locationHistory, { onDelete: 'CASCADE' })
  asset: IAsset|string;

  @ManyToOne(() => Location, (location) => location.locationHistory, { onDelete: 'CASCADE' })
  location: Ilocation|string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;  
      
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
