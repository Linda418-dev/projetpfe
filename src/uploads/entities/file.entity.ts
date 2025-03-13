import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Asset } from 'src/assets/Entities/Asset.entity';  

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  urlFile: string;

  @Column()
  typeFile: string;

  @Column({ nullable: true })
  assetId: number | null;

  @ManyToOne(() => Asset, (asset) => asset.files, { nullable: true })
  asset: Asset; 
}
