import { Asset } from 'src/assets/Entities/Asset.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

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

  @ManyToOne(() => Asset, (asset) => asset.files)
  asset: Asset;
}
