import { Asset } from "src/assets/Entities/Asset.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Ifile } from "../types/interface/File.interface";


@Entity()
export class File implements Ifile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @ManyToOne(() => Asset, (asset) => asset.files)
  asset: Asset;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
