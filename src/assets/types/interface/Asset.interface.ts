import { Ilocation } from "src/location/types/interfaces/location.interface";
import { Iidentfiable } from "src/Shared/Interface/Identfiable.interface";

export interface IAsset extends Iidentfiable{
    name : string;
    location: Ilocation | string;


}