import { Column, CreateDateColumn, Entity,  ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IUser } from "../types/interface/user.interface";
import { UserRole } from "src/user-role/entities/user-role.entity";
import { Affectation } from "src/affectation/entities/affectation.entity";
import { IUserRole } from "src/user-role/types/interface/user-role.interface";
import { Iaffectation } from "src/affectation/types/interfaces/affectation.interface";
import { Anomaly } from "src/anomaly/Entities/anomaly.entity";
import { IAnomaly } from "src/anomaly/types/interface/anomaly.interface";

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({nullable: true })
  playerId: string;

  @Column({ unique: true, nullable: true }) 
  username?: string;

  @Column({ unique: true, nullable: true }) 
  email?: string;

  @Column({ select: false })
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => UserRole, (role) => role.users, { eager: true })
  role: IUserRole|string;

  @OneToMany(() => Affectation, (affectation) => affectation.operator)
  affectations: Iaffectation[]|string[];

  @OneToMany(() => Anomaly, (anomaly) => anomaly.operator)
  anomalies: IAnomaly[]|string[];
   
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
