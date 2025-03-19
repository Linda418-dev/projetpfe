import { Iidentfiable } from "src/Shared/Interface/Identfiable.interface";

export interface IUser extends Iidentfiable {
    email: string;
    password: string;
    role: string;
}