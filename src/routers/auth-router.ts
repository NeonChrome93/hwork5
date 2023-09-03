import {Request, Response, Router} from "express";
import {userService} from "../domain/users-servise";
import {validationLoginAuth} from "../middlewares/validations/auth-logiin-validation";
import {jwtService} from "../application/jwt-service";
import {authMiddleware} from "../middlewares/auth";


export const authRouter = Router({})

authRouter.post('/login',
    ...validationLoginAuth,
    async (req: Request, res: Response) => {

        //req.body.loginOrEmail
        //req.body.password
        const {loginOrEmail, password} = req.body
        const user = await userService.checkCredentials(loginOrEmail, password)
        if (user) {
            const token = await jwtService.createJWT(user)
            //const tokens = await jwtService.createTokens(userId)
            res.status(200).send({accessToken: token} )//req.headers.authorization = ''
        } else {
            res.sendStatus(401)
        }
    })

authRouter.get('/me',
    authMiddleware,
    (req: Request, res: Response) => {

    const user = req.user
        res.status(200).send({
            email: user!.email,
            login: user!.login,
            userId: user!._id.toString()
        })
})

//secret + payload(userId) -> "dfjgghdi.jgidrhger.lghltehghd"