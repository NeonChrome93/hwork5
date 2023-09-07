import {UserCreateModel, UserDbModel, UserViewModel} from "../models/users-models/user.models";
import bcrypt from "bcrypt";
import {ObjectId} from "mongodb";
import {usersRepository} from "../repositories/users/users-repository-database";
import {userService} from "./users-servise";
import {emailService} from "../application/email-servise";
import {randomUUID} from "crypto";


export const authService = {

    async registrationUser(userCreateModel: UserCreateModel): Promise<UserViewModel> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await userService.generateHash(userCreateModel.password, passwordSalt)

        const newUser: UserDbModel = {
            _id: new ObjectId(),
            login: userCreateModel.login, //valitation not copy in database
            email: userCreateModel.email, //
            passwordHash: passwordHash,
            passwordSalt: passwordSalt,
            createdAt: new Date().toISOString(),
            confirmationCode: randomUUID(), //generate code UUID //
            isConfirmed: false // by registration
        }
        await usersRepository.createUser(newUser);
        await emailService.sendEmail(newUser.email, newUser.confirmationCode, 'It is your code')
        return {
            id: newUser._id.toString(),
            login: newUser.login,
            email: newUser.email,
            createdAt: newUser.createdAt
        }
    },

    async confirmEmail (code: string) {
        const user = await usersRepository.readUserByCode(code)
        if (!user) return false;
        await usersRepository.confirmEmail(user._id.toString())
        return true

    }



}