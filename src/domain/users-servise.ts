
import {usersRepository} from "../repositories/users/users-repository-database";
import bcrypt from 'bcrypt'
import {UserCreateModel, UserDbModel, UserViewModel} from "../models/users-models/user.models";
import {ObjectId} from "mongodb";
import { QueryUserPaginationType} from "../middlewares/pagination";
import {PaginationModels} from "../models/pagination/pagination-models";







export const userServiсe = {

    async getUsers(pagination:  QueryUserPaginationType) :Promise<PaginationModels<UserViewModel[]>> {
        return usersRepository.getUsers(pagination)
    },

    async createUser(userCreateModel: UserCreateModel): Promise<UserViewModel> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(userCreateModel.password, passwordSalt)

        const newUser: UserDbModel = {
            _id: new ObjectId(),
            login: userCreateModel.login,
            email: userCreateModel.email,
            passwordHash: passwordHash,
            passwordSalt: passwordSalt,
            createdAt: new Date().toISOString(),
        }
        await usersRepository.createUser(newUser)
        return {
            id: newUser._id.toString(),
            login: newUser.login,
            email: newUser.email,
            createdAt: newUser.createdAt
        }
    },

    // async findUserById(id: string): Promise<usersOutputType | null> {
    //     return usersRepository.readUserById(id)
    // },

    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail)
        if (!user) return false
        const passwordHash = await this._generateHash(password, user.passwordSalt)
        if (user.passwordHash !== passwordHash) {
            return false
        }
        return user

    },
    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash
    },

    async deleteUser(id: string): Promise<boolean> {
        const user = await usersRepository.readUserById(id)
        if (!user) return false
        return usersRepository.deleteUser(id)
    }

}