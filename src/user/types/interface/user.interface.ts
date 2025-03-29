import { Iidentfiable } from "src/Shared/Interface/Identfiable.interface";

export interface IUser extends Iidentfiable {
    username?: string;
    email?: string;
    password: string;
}