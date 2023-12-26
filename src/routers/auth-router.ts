import  {Request, Response, Router} from "express";
import {validationLoginAuth} from "../middlewares/validations/auth-logiin-validation";
import {jwtService} from "../application/jwt-service";
import {authMiddleware, checkRefreshToken} from "../middlewares/auth";
import {authService} from "../domain/auth-service";
import nodemailer from "nodemailer";
import {confirmationCodeValidator} from "../middlewares/validations/confirmation-code-validator";
import {usersRepository} from "../repositories/users/users-repository-database";
import {confirmationEmailValidation} from "../middlewares/validations/confirmation-email-validation";
import {userRegistrationEmailValidation} from "../middlewares/validations/user-registration-email-validation";
import {devicesService} from "../domain/devices-service";
import {devicesRepository} from "../repositories/devices/devices-repository";
//import {devicesCollection} from "../db/database";
import {countApiRequests} from "../middlewares/limiter";
import {userNewPasswordValidation} from "../middlewares/validations/user-new-password-validation";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/validations/input-validation-middleware";

export const authRouter = Router({})

authRouter.post('/login', countApiRequests, ...validationLoginAuth,
    async (req: Request, res: Response) => {
        const {loginOrEmail, password} = req.body
        const result = await authService.login(loginOrEmail, password, req.ip, req.headers['user-agent'] || 'x') // alt+ enter
        if (!result) return res.sendStatus(401)
        return res
            .cookie('refreshToken', result.refreshToken, {httpOnly: true, secure: true})
            .status(200)
            .send({accessToken: result.accessToken})
    })

authRouter.post('/refresh-token', countApiRequests, checkRefreshToken, async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    //добавить миддлвару на наличие токена
    if (!refreshToken) {
        return res.sendStatus(401)
    }
    // Генерация новых токенов на основе переданных данных, например, идентификатора пользователя
    const user = await usersRepository.readUserById(req.user!._id.toString())
    if (!user) return res.sendStatus(401)

    //const device = await findDeviceById(payload.deviceId)
    // if(device.lastActiveDate !== payload.lastActiveDate) return res.sendStatus(401)
    const result = await authService.refresh(user, refreshToken)
    if (!result) return res.sendStatus(401)
    return res
        .cookie('refreshToken', result.newRefreshToken, {httpOnly: true, secure: true})
        .status(200)
        .send({accessToken: result.accessToken})


})
authRouter.post('/logout', checkRefreshToken, async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken

    //добавить миддлвару на наличие токена

    if (refreshToken) {


        const lastActiveDate = jwtService.lastActiveDate(refreshToken)

        const device = await devicesService.findDeviceById(req.deviceId!.toString())
        if (!device) return res.sendStatus(401)
        if (device.lastActiveDate !== lastActiveDate) return res.sendStatus(401)
        await devicesRepository.deleteDevicesById(req.deviceId!.toString())
        //достать device из БД и сравнить lastActiveDate из БД и из текущего токена
        //delete device by deviceId
        //в чс уже не помещает, выйти с текущего устройства

        return res.sendStatus(204)
    } else {
        return res.sendStatus(401)
    }


})


authRouter.post('/registration', countApiRequests, ...userRegistrationEmailValidation, async (req: Request, res: Response) => {


    await authService.registrationUser({
        login: req.body.login,
        email: req.body.email,
        password: req.body.password,
        //message: req.body.message
    })
    return res.sendStatus(204);

})

authRouter.post('/registration-confirmation', countApiRequests, ...confirmationCodeValidator, async (req: Request, res: Response) => {
    const isConfirmed = await authService.confirmEmail(req.body.code)
    if (isConfirmed) return res.sendStatus(204)
    return res.sendStatus(400)
})

authRouter.post("/password-recovery", countApiRequests, body('email').isEmail(),inputValidationMiddleware, async (req: Request, res: Response) => {
    const result = await authService.passwordRecovery(req.body.email)
   res.sendStatus(204)
})

authRouter.post('/new-password', countApiRequests, ...userNewPasswordValidation, async (req: Request, res: Response) => {
 const result = await authService.newPasswordSet(req.body.newPassword, req.body.recoveryCode)
    //0. валидация req.body
    //1. найти юзера по recoveryCode(если юзера нет в бд, кинуть ошибку)
    //2. поменять пароль юзера на новый
    //3. сохранить юзера в бд
    if(!result){
        res.sendStatus(400)
    }
    else res.sendStatus(204)
})



authRouter.post('/registration-email-resending', countApiRequests, ...confirmationEmailValidation, async (req: Request, res: Response) => {
    const receivedCode = await authService.resendingCode(req.body.email)
    if (receivedCode) return res.sendStatus(204)

    return res.sendStatus(400)
//юзеру может не прийти код, сгенерировать новый,записать в базу,  переслать код еще раз по емайл новый код
})

//1)Регистрация в системе отправить письмо с кодом, код обернуть в ссылку swagger
//2)auth: подтверждение регистрации при помощи кода, отправленного внутри ссылки на почту
// (в письмо нужно вставить обязательно ссылку (можно и в тег а, можно без html), аккунт существует регистрация завершена
// и в ссылке должен быть query-параметр code, например:
//3)auth: переотправка письма с кодом регистрации. сгенерировать новый код сохранить в БД и отправить на почту
// при создании пользователя супер админом (POST "/users")
// - подтверждения почты не требуется (пользователь сразу же после создания может входить в систему)
//two endpoints
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