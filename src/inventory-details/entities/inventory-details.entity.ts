import { Affectation } from 'src/affectation/entities/affectation.entity';
import { AssetStatus } from 'src/asset-status/entities/asset-status.entity';
import { LocationHistory } from 'src/location-history/entities/location-history.entity';
import { File } from 'src/uploads/entities/file.entity';
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, OneToMany, Column } from 'typeorm';

@Entity()
export class  InventoryDetails{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  scannedAt: Date;

  @ManyToOne(() => Affectation, (affectation) => affectation.inventoryDetails, { onDelete: 'CASCADE',})
  affectation: Affectation;

  @Column({ nullable: true })
  assetId: string;

  @ManyToOne(() => LocationHistory, { eager: true, onDelete: 'SET NULL', nullable: true })
  locationHistory: LocationHistory;

  @ManyToOne(() => AssetStatus, { eager: true, onDelete: 'SET NULL', nullable: true, })
  assetStatus: AssetStatus;

  @OneToMany(() => File, (file) => file.inventoryDetails, { cascade: true })
  files: File[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
