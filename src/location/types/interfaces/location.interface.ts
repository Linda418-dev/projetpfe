import { IService } from "src/service/types/interfaces/service.interface";
import { Iidentfiable } from "src/Shared/Interface/Identfiable.interface";

export interface Ilocation extends Iidentfiable {
    name: string;
    service?: IService | string;
}