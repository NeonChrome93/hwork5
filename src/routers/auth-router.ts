import {Request, Response, Router} from "express";
import {userService} from "../domain/users-servise";
import {validationLoginAuth} from "../middlewares/validations/auth-logiin-validation";
import {jwtService} from "../application/jwt-service";
import {authMiddleware, checkRefreshToken} from "../middlewares/auth";
import {validationCreateUser} from "../middlewares/validations/user-create-validation";
import {authService} from "../domain/auth-service";
import nodemailer from "nodemailer";
import {confirmationCodeValidator} from "../middlewares/validations/confirmation-code-validator";
import {usersRepository} from "../repositories/users/users-repository-database";
import {confirmationEmailValidation} from "../middlewares/validations/confirmation-email-validation";
import {userRegistrationEmailValidation} from "../middlewares/validations/user-registration-email-validation";
import {randomUUID} from "crypto";
import {devicesService} from "../domain/devices-service";
import {devicesRepository} from "../repositories/devices/devices-repository";
import {devicesCollection} from "../db/database";
import {countApiRequests} from "../middlewares/limiter";

export const authRouter = Router({})

authRouter.post('/login', countApiRequests,...validationLoginAuth,
    async (req: Request, res: Response) => {
        const {loginOrEmail, password} = req.body
        const result = await authService.login(loginOrEmail, password, req.ip, req.headers['user-agent'] || '') // alt+ enter
        if(!result) return res.sendStatus(401)
      return  res
            .cookie('refreshToken', result.refreshToken, {httpOnly: true, secure: true})
            .status(200)
            .send({accessToken: result.accessToken})
    })

authRouter.post('/refresh-token' , countApiRequests, checkRefreshToken,  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken


//добавить миддлвару на наличие токена
    if (refreshToken) {
        // Генерация новых токенов на основе переданных данных, например, идентификатора пользователя
        //Проверить нет ли рефреш токена в черном списке

        const payload = jwtService.getDeviceIdByToken(refreshToken)

        const user = await usersRepository.readUserById(req.user!._id.toString())
        if (!user) return res.sendStatus(401)

       //const device = await findDeviceById(payload.deviceId)
       // if(device.lastActiveDate !== payload.lastActiveDate) return res.sendStatus(401)

        //обновить дату lastActiveDate проверка сравнить ластактивдейт девайса со временм выписки токена, взять
        const accessToken = jwtService.createJWT(user);
        const  newRefreshToken = jwtService.generateRefreshToken(user, payload.deviceId);
        //узнать дату когда он был создан и присвоить к девайсу
const lastActiveDate = jwtService.lastActiveDate(newRefreshToken);
//update device lastActiveDate-> repo

        // Создать метод в репозитории и туда кинуть старый рефрещ токен
        //res.cookie('accessToken', accessToken, {httpOnly: true, secure: true});
        res.cookie('refreshToken', newRefreshToken, {httpOnly: true, secure: true});

        res.status(200).send({accessToken: accessToken})
    } else {
        return res.sendStatus(401)
    }

})
authRouter.post('/logout', checkRefreshToken, async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken

    //добавить миддлвару на наличие токена

    if (refreshToken) {


        const lastActiveDate = jwtService.lastActiveDate(refreshToken)

        const device = await devicesService.findDeviceById(req.deviceId!.toString())
        if(!device) return res.sendStatus(401)
        if(device.lastActiveDate !== lastActiveDate) return res.sendStatus(401)
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


authRouter.post('/registration-email-resending', countApiRequests, ...confirmationEmailValidation, async (req: Request, res: Response) => {
    const receivedСode = await authService.resendingCode(req.body.email)
    if (receivedСode)  return  res.sendStatus(204)

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