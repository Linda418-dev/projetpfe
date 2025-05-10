import { CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ILocationHistory } from '../types/interfaces/location-history.interface';
import { Asset } from 'src/assets/Entities/asset.entity';
import { Location } from 'src/location/entities/location.entity';

@Entity()
export class LocationHistory implements ILocationHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Asset, (asset) => asset.locationHistory, { onDelete: 'CASCADE' })
  asset: Asset;

  @ManyToOne(() => Location, (location) => location.locationHistory, { onDelete: 'CASCADE' })
  location: Location;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;  
      
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
