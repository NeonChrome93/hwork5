import {Request,Response,Router} from "express";
import {userServiсe} from "../domain/users-servise";
import {validationLoginAuth} from "../middlewares/auth-logiin-validation";

export const authRouter = Router({})

authRouter.post('/login',
    ...validationLoginAuth,
    async (req: Request<{},{},{loginOrEmail: string, password: string}>, res: Response) => {

    //req.body.loginOrEmail
    //req.body.password
const checkResult = await userServiсe.checkCredentials(req.body.loginOrEmail, req.body.password)
if(!checkResult) {
    res.sendStatus(401)
} else res.send(204)
})