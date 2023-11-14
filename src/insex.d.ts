
import {DevicesDBType} from "./models/devices-models";
import {UserDbModel} from "./domain/entities/users-entity";

declare global {
    namespace Express {
        export interface Request {
            user:  UserDbModel | null
            userId:  string | null
            deviceId: string | null
        }
    }
}