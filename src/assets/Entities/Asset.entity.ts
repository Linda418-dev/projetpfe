import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { File } from 'src/uploads/entities/file.entity';  

@Entity('asset')
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

 

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => File, (file) => file.asset)
  files: File[];  
}
