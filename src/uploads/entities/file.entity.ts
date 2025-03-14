import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Asset } from 'src/assets/Entities/Asset.entity';

@Entity('file')
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  urlFile: string;

  @Column()
  typeFile: string;

  @ManyToOne(() => Asset, (asset) => asset.files, { nullable: true, eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assetId' })
  asset: Asset;

  @Column({ nullable: true })  // Ajoute cette colonne si elle n'existe pas
  assetId: string;  // Cette colonne est nécessaire pour stocker l'ID de l'asset
}

