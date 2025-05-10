import { Column, CreateDateColumn, Entity,  ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IUser } from "../types/interface/user.interface";
import { UserRole } from "src/user-role/entities/user-role.entity";
import { Affectation } from "src/affectation/entities/affectation.entity";

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true,nullable: true })
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
  role: UserRole;

  @OneToMany(() => Affectation, (affectation) => affectation.operator)
  affectations: Affectation[];
   
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
