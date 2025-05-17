import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IUserRole } from "../types/interface/user-role.interface";
import { User } from "src/user/entities/user.entity";
import { UserRoleEnum } from "../types/enums/user-role.enum";
import { IUser } from "src/user/types/interface/user.interface";


@Entity()
export class UserRole  implements IUserRole {
  
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: UserRoleEnum, unique: true })
  role: UserRoleEnum;

  @OneToMany(() => User, (user) => user.role)
  users: IUser[]|string[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}