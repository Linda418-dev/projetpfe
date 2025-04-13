import { Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { User } from 'src/user/entities/user.entity';
import { Department } from 'src/department/entities/department.entity';


@Entity()
export class InventoryAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  

  @ManyToOne(() => User)
  user: User;

  @ManyToMany(() => Department)
  @JoinTable()
  departments: Department[];
}
