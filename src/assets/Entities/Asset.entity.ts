import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IAsset } from "../types/interface/Asset.interface";
import { File } from "src/File/Entities/File.entity";

@Entity()
export class Asset implements IAsset{
    @PrimaryGeneratedColumn('uuid')
    id: string; 
    
    @Column()
    name: string;
    
    @Column({ nullable: true })
    imageUrl: string;

    @OneToMany(() => File, (file) => file.asset)   
    files: File[];
    
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
      
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

}