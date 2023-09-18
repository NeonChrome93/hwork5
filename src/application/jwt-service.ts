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
         const result : any = jwt.verify(token,configKeys.accessTokenPrivateKey )
            return result.userId

        }
        catch (error) {
            return null
        }
    },
 //jwt.decode - можно достать  дату окончания действия токена
   generateRefreshToken(user: UserDbModel) { //deviceId
        return jwt.sign({userId: user._id}, configKeys.accessTokenPrivateKey, {
            expiresIn: '20s',
        });

    }

    //создать токен с настройками и вернуть токен в куку createCookieToken
}

