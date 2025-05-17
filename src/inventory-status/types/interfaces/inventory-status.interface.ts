import { Iinventory } from "src/inventory/types/interfaces/inventory.interface";
import { Iidentfiable } from "src/Shared/Interface/Identfiable.interface";
import { Istatus } from "src/status/types/interfaces/status.interface";

export interface IinventoryStatus extends Iidentfiable {
   inventory: Iinventory | string;
  status: Istatus | string;
}