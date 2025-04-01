import { Iidentfiable } from "src/Shared/Interface/Identfiable.interface";

export interface Iinventory extends Iidentfiable {
    launchDate: Date;
    closingDate: Date | null; 
}