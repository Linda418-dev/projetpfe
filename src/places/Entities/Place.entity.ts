import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IPlace } from "../Types/interfaces/Place.interface";
import { PlaceType } from "../Types/enums/Place-type.enum";
import { Asset } from "src/assets/Entities/Asset.entity";
import { Department } from "src/department/entities/department.entity";

@Entity()
export class Place implements IPlace{
   
    @PrimaryGeneratedColumn('uuid')
    id: string;  
   

    @Column()
    name: string;


    @Column()
    description: string;
    
    @Column({
        type: 'enum',
        enum: PlaceType, 
        default: PlaceType.OTHER, 
      })
    type: PlaceType;

    /*@OneToMany(() => Asset, (asset) => asset.place)
    assets: Asset[];*/

    @Column("simple-array", { nullable: true, default: [] }) 
    assetsNames: string[];

    @OneToMany(() => Department, (department) => department.place)
    departments: Department[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;  
    
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
  
    
}