import { IAnomaly } from "src/anomaly/types/interface/anomaly.interface";
import { Iidentfiable } from "src/Shared/Interface/Identfiable.interface";
import { Istatus } from "src/status/types/interfaces/status.interface";

export interface IAnomalyStatus extends Iidentfiable {
    anomaly: IAnomaly | string;
    status: Istatus | string;
}