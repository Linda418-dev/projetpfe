import { Asset } from 'src/assets/Entities/asset.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn,  CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { IAssetAssignment } from '../types/interface/asset-assignment.interface';

@Entity('asset_assignment')
export class AssetAssignment implements IAssetAssignment{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Asset, { eager: true, onDelete: 'CASCADE' })
  asset: Asset | string;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  employee: User | string;

  @CreateDateColumn()
  assignedAt: Date;
  
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date; 

}
