import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Iinventory } from '../types/interfaces/inventory.interface';
import { Affectation } from 'src/affectation/entities/affectation.entity';
import { Site } from 'src/site/Entities/site.entity';


@Entity()
export class Inventory implements Iinventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date ; 

  @OneToMany(() => Affectation, (affectation) => affectation.inventory)
  affectations: Affectation[];

  @ManyToOne(() => Site, { eager: true }) // `eager` si tu veux charger automatiquement le site
  site: Site; 

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;  
      
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
