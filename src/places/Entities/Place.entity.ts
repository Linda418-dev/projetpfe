import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IPlace } from "../Types/interfaces/Place.interface";
import { PlaceType } from "../Types/enums/Place-type.enum";

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

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;  
    
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
  
    
}