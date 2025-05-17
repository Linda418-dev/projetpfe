import { User } from 'src/user/entities/user.entity';
import { IUser } from 'src/user/types/interface/user.interface';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('simple-array')
  playerIds: string[];

  @Column()
  title: string;

  @Column()
  message: string;

  @ManyToMany(() => User)
  @JoinTable()
  recipients: IUser[]|string[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;  
        
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
