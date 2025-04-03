import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IUser } from "../types/interface/user.interface";
import { UserRole } from "src/user-role/entities/user-role.entity";
import { Inventory } from "src/inventory/entities/inventory.entity";

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true }) 
  username?: string;

  @Column({ unique: true, nullable: true }) 
  email?: string;

  @Column()
  password: string;

  @ManyToOne(() => UserRole, (role) => role.users, { eager: true })
  role: UserRole;
   

  @ManyToMany(() => Inventory, (inventory) => inventory.users)
  inventories: Inventory[];
  
  
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
