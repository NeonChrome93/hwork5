import {NextFunction, Request, Response} from "express";
import {userService} from "../domain/users-servise";
import {jwtService} from "../application/jwt-service";


const users = {
    login: 'admin',
    password: 'qwerty'
}

export const authGuardMiddleware = ( req: Request, res : Response, next: NextFunction) => {
    // res.send(shops)
    console.log('header', req.headers)
    const encode = Buffer.from(`${users.login}:${users.password}`, "utf-8").toString("base64")
    console.log(encode)
    if(req.headers.authorization === `Basic ${encode}`) {
        next();
    }
    else res.sendStatus(401)
}

export const authMiddleware = async ( req: Request, res : Response, next: NextFunction) => {
    if(!req.headers.authorization){
        res.sendStatus(401)
        return
    }

    const token = req.headers.authorization.split(' ')[1];
    const userId = await jwtService.getUserIdByToken(token)


    if(userId) {
        req.user = await userService.findUserById(userId.toString())
        next();
    }
    else res.sendStatus(401)
}