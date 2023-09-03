import {UserDbModel} from "./models/users-models/user.models";

declare global {
    namespace Express {
        export interface Request {
            user:  UserDbModel | null
        }
    }
}