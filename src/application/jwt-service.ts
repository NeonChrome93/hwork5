import jwt, {JwtPayload} from 'jsonwebtoken'
import {UserDbModel} from "../models/users-models/user.models";
import {ObjectId} from "mongodb";
import {configKeys} from "../config";


export const jwtService = {

    createJWT(user: UserDbModel) {
        const token = jwt.sign({userId: user._id}, configKeys.accessTokenPrivateKey, {expiresIn: '10s'})
        return token
    },

    getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, configKeys.accessTokenPrivateKey)
            return result.userId

        } catch (error) {
            return null
        }
    },

    //jwt.decode - можно достать дату выдачи и сохранить в БД + добавить переменную девайс ID
    generateRefreshToken(user: UserDbModel, deviceId: string) { //deviceId
        return jwt.sign({userId: user._id, deviceId: deviceId}, configKeys.accessTokenPrivateKey, {
            expiresIn: '20s',
        });

    },

    getDeviceIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, configKeys.accessTokenPrivateKey)
            return result //==={userId: user._id, deviceId: deviceId}

        } catch (error) {
            return null
        }
    },


    lastActiveDate(token: string): string {
        const result: any = jwt.decode(token)
        return new Date(result.iat * 1000).toISOString()//милесекунды и в строку
        //дата выписки токена это мое последнее посещение, закинуть в девайс репу

    },

    //создать токен с настройками и вернуть токен в куку createCookieToken +
}

