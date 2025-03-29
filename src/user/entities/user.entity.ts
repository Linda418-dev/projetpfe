import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IUser } from "../types/interface/user.interface";
import { UserRole } from "src/user-role/entities/user-role.entity";

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true }) // Permet d'accepter NULL
  username?: string;

  @Column({ unique: true, nullable: true }) // Permet d'accepter NULL
  email?: string;

  @Column()
  password: string;

  @ManyToOne(() => UserRole, (role) => role.users, { eager: true })
  role: UserRole;
   
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
