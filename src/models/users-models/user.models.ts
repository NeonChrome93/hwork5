import {ObjectId} from "mongodb";

export type UserCreateModel = {
    login: string
    email: string
    password: string
}

export type UserDbModel = {
    _id: ObjectId
    login: string
    email: string
    passwordSalt: string
    passwordHash: string
    createdAt: string
}

export type UserViewModel = {
    id: string
    login: string
    email: string
    createdAt: string
}
