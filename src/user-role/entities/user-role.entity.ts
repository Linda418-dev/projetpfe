import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IUserRole } from "../interface/user-role.interface";
import { User } from "src/user/entities/user.entity";
import { UserRoleEnum } from "../enums/user-role.enum";


@Entity()
export class UserRole  implements IUserRole {
  
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: UserRoleEnum, unique: true })
  role: UserRoleEnum;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}