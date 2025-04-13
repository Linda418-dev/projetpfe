import { Iidentfiable } from "src/Shared/Interface/Identfiable.interface";

export interface Istatus extends Iidentfiable {
    name: string;
    type: 'asset' | 'inventory';
}