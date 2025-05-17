import { Iidentfiable } from "src/Shared/Interface/Identfiable.interface";
import { UserRoleEnum } from "../enums/user-role.enum";

export interface IUserRole extends Iidentfiable {
  role: UserRoleEnum; 
}