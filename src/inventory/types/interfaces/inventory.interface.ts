import { Iidentfiable } from "src/Shared/Interface/Identfiable.interface";

export interface Iinventory extends Iidentfiable {
    name: string;
    launchDate: Date;
    closingDate: Date | null; 
}