import {UserCreateModel, UserViewModel} from "../models/users-models/user.models";
import bcrypt from "bcrypt";
import {ObjectId} from "mongodb";
import {usersRepository} from "../repositories/users/users-repository-database";
import {userService} from "./users-servise";
import {emailService} from "../application/email-servise";
import {randomUUID} from "crypto";
import {jwtService} from "../application/jwt-service";
import {devicesService} from "./devices-service";
import {devicesRepository} from "../repositories/devices/devices-repository";
import {add} from "date-fns"
import e from "express";
import {DeviceModel} from "./entities/devices-entity";
import {UserDbModel, UserModel} from "./entities/users-entity";


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
            createdAt: new Date(),
            confirmationCode: randomUUID(), //generate code UUID //
            isConfirmed: false, // by registration
            expirationDateOfRecoveryCode: null,
            passwordRecoveryCode: null
        }
        await usersRepository.createUser(newUser);
        try {
            emailService.sendEmail(newUser.email, newUser.confirmationCode, 'It is your code')
        } catch (e) {
            console.log('registration user email error', e);
        }
        return {
            id: newUser._id.toString(),
            login: newUser.login,
            email: newUser.email,
            createdAt: newUser.createdAt.toISOString()
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
        if (!user) return false;
        const newCode = randomUUID()
        await usersRepository.updateConfirmationCode(user._id.toString(), newCode);
        try {
            emailService.sendEmail(user.email, newCode, 'It is your code');
        } catch (e) {
            console.log("code resending email error", e);
        }

        return true

    },

    async passwordRecovery(email: string): Promise<boolean> {
        const user = await usersRepository.readUserByEmail(email)
        if (!user) return false;

       user.passwordRecoveryCode =  randomUUID();
       user.expirationDateOfRecoveryCode = add(new Date(), {
           hours: 1,
           minutes: 3
       });

        await usersRepository.saveUser(user);

        try {
            emailService.resendEmail(email, user.passwordRecoveryCode)
        } catch (e) {
            console.log("code resending email error", e);
        }

        return true

    },

    async newPasswordSet(newPassword: string, recoveryCode: string) :Promise<boolean>  {
        const user = await usersRepository.findUserByRecoveryCode(recoveryCode)
        if(!user) return false

        if(user.expirationDateOfRecoveryCode && user.expirationDateOfRecoveryCode < new Date()) return false

        user.passwordHash = await userService.generateHash(newPassword, user.passwordSalt)
        user.passwordRecoveryCode = null
        user.expirationDateOfRecoveryCode = null

        await usersRepository.saveUser(user)

        return true

    },


    async login(loginOrEmail: string, password: string, ip: string, title: string): Promise<{ accessToken: string, refreshToken: string } | null> {
        const user = await userService.checkCredentials(loginOrEmail, password)
        if (!user) return null
        const accessToken = jwtService.createJWT(user);
        const deviceId = randomUUID()
        const refreshToken = jwtService.generateRefreshToken(user, deviceId);
        const lastActiveDate = jwtService.lastActiveDate(refreshToken)// взять дату выписки этого токена === lastActiveDate у девайся
        await devicesService.createDevice(ip, deviceId, user._id.toString(), title, lastActiveDate)
        return {
            accessToken,
            refreshToken
        }
    },

    async refresh(user: UserDbModel, refreshToken: string): Promise<{ accessToken: string, newRefreshToken: string } | null> {
        const payload = jwtService.getDeviceIdByToken(refreshToken)
        const accessToken = jwtService.createJWT(user);
        const newRefreshToken = jwtService.generateRefreshToken(user, payload.deviceId);
        const lastActiveDate = jwtService.lastActiveDate(newRefreshToken);
        await devicesRepository.updateDeviceLastActiveDate(payload.deviceId, lastActiveDate)
        return {
            accessToken,
            newRefreshToken
        }
    }
}