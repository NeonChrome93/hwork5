import {UserDbModel} from "./models/users-models/user.models";
import {DevicesDBType} from "./models/devices-models";

declare global {
    namespace Express {
        export interface Request {
            user:  UserDbModel | null
            deviceId: string | null
        }
    }
}