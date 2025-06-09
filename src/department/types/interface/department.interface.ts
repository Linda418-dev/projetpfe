import { Iidentfiable } from "src/Shared/Interface/Identfiable.interface";
import { Isite } from "src/site/Types/interfaces/site.interface";

export interface IDepartment extends Iidentfiable{
    name : string;
    site?: Isite | string;
    
}