import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IAsset } from "../types/interface/Asset.interface";
import { Category } from "src/category/Entities/category.entity";
import { Supplier } from "src/supplier/Entities/Supplier.entity";
import { Place } from "src/places/Entities/Place.entity";

@Entity()
export class Asset implements IAsset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
  
  @ManyToOne(() => Category, (category) => category.assets, { eager: true, onDelete: 'SET NULL' }) 
  category: Category | null;
  
  @ManyToOne(() => Supplier, (supplier) => supplier.assets, { eager: true, nullable: true, onDelete: 'SET NULL' })
  supplier: Supplier | null;

  // Optionnel : pour simplifier l'affichage côté front, on peut stocker le nom de la catégorie
  @Column({ nullable: true })
  categoryName?: string;

  // Relation avec Place, chargée en mode eager pour obtenir directement l'objet
  @ManyToOne(() => Place, (place) => place.assets, { eager: true, nullable: true, onDelete: 'SET NULL' })
  place: Place | null;

  // Colonne pour stocker le nom du lieu (s'il n'est pas récupéré via la relation)
  @Column({ type: 'varchar', nullable: true, default: '' })
  placeName?: string;
  
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
