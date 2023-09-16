import jwt, {JwtPayload} from 'jsonwebtoken'
import {UserDbModel} from "../models/users-models/user.models";
import {ObjectId} from "mongodb";


export const jwtService = {

    async createJWT(user: UserDbModel) {
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET || "123", {expiresIn: '12h'})
        return token
    },

    async getUserIdByToken(token: string) {
        try {
         const result : any = jwt.verify(token,process.env.JWT_SECRET || "123")
            return new ObjectId(result.userId)
        }
        catch (error) {
            return null
        }
    },

    async generateRefreshToken(user: UserDbModel) {
        return jwt.sign({userId: user._id}, process.env.JWT_SECRET || "123", {
            expiresIn: '7h',
        });

    }

    //создать токен с настройками и вернуть токен в куку createCookieToken
}

