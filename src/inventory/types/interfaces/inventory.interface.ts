import { Iidentfiable } from "src/Shared/Interface/Identfiable.interface";

export interface Iinventory extends Iidentfiable {
    name: string;
    startDate: Date;
    endDate: Date ; 
}