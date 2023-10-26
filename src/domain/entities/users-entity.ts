import {ObjectId} from "mongodb";
import mongoose, {Schema} from "mongoose";
import {BlogDbType} from "./blog-entity";
import {randomUUID} from "crypto";


export type UserDbModel = {
    _id: ObjectId,
    login: string,
    email: string,
    passwordSalt: string,
    passwordHash: string,
    createdAt: Date,
    confirmationCode: string,
    isConfirmed: boolean,
    passwordRecoveryCode: string | null,
    expirationDateOfRecoveryCode: Date | null

}

const usersSchema = new mongoose.Schema<UserDbModel>({
    login: {type: String, required: true},
    email: {type: String, required: true},
    passwordSalt: {type: String, required: true},
    passwordHash: {type: String, required: true},
    createdAt: {type: Date, default: new Date},
    confirmationCode: {type: String, required: true},
    isConfirmed: {type: Boolean, required: true},
    passwordRecoveryCode: {type: String, default: null },
    expirationDateOfRecoveryCode: {type: Date, default: null}

})

export const UserModel = mongoose.model<mongoose.Schema<UserDbModel>>("users", usersSchema)