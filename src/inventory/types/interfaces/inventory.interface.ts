import {  Iaffectation } from "src/affectation/types/interfaces/affectation.interface";
import { IinventoryStatus } from "src/inventory-status/types/interfaces/inventory-status.interface";
import { Iidentfiable } from "src/Shared/Interface/Identfiable.interface";
import { Isite } from "src/site/Types/interfaces/site.interface";

export interface Iinventory extends Iidentfiable {
    name: string;
    startDate: Date;
    endDate: Date ; 
     site: Isite | string;
  affectations: Iaffectation[] | string[];
  inventoryStatus: IinventoryStatus[] | string[];
}