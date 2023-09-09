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
        try {
            await emailService.sendEmail(newUser.email, newUser.confirmationCode, 'It is your code')
        } catch (e) {
            console.log('registration user email error', e);
        }
        return {
            id: newUser._id.toString(),
            login: newUser.login,
            email: newUser.email,
            createdAt: newUser.createdAt
        }
    },
//подтверждение email
    async confirmEmail(code: string) {
        const user = await usersRepository.readUserByCode(code)
        if (!user) return false;
        await usersRepository.confirmEmail(user._id.toString())
        return true

    },

    async resendingCode(email: string): Promise<boolean> {
        const user = await usersRepository.readUserByEmail(email)
        console.log(user, "user")
        if (!user) return false;
        const newCode = randomUUID()
        await usersRepository.updateConfirmationCode(user._id.toString(), newCode);
        try {
            await emailService.sendEmail(user.email, newCode, 'It is your code')
        } catch (e) {
            console.log("code resending email error", e);
        }

        const usera = await usersRepository.readUserByEmail(email)
        console.log(usera, "user")

        return true

    },


}