import { IDepartment } from "src/department/types/interface/department.interface";
import { Iidentfiable } from "src/Shared/Interface/Identfiable.interface";

export interface IService extends Iidentfiable {
    name: string;
      department?: IDepartment | string;

    
}