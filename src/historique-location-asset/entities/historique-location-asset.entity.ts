import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Asset } from 'src/assets/Entities/Asset.entity';
import { Place } from 'src/places/Entities/Place.entity';

@Entity('historique_location_asset')
export class HistoriqueLocationAsset {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Asset, { eager: true, onDelete: "CASCADE" })
    asset: Asset;

    @Column()
    assetId: string;

    @Column()
    assetName: string;

    @ManyToOne(() => Place, { eager: true, onDelete: "CASCADE" })
    place: Place;

    @Column()
    locationId: string;

    @Column()
    locationName: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
}