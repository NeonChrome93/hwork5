import {Request, Response, Router} from "express";
import {getQueryUserPagination} from "../middlewares/pagination";
import {userService} from "../domain/users-servise";
import {devicesRepository} from "../repositories/devices/devices-repository";
import {jwtService} from "../application/jwt-service";
import {devicesService} from "../domain/devices-service";
import {checkRefreshToken} from "../middlewares/auth";


export const securityDevisesRouter = Router({})


securityDevisesRouter.get('/devices', checkRefreshToken, async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) res.sendStatus(401)
    const userId = jwtService.getUserIdByToken(refreshToken)
    const devises = await devicesRepository.findAllUserDevices(userId)
    res.status(200).send(devises);
//-> queryRepo-> deviceCollection.find(userId)
    //сделать миддлвару проверить токен прервать там на 401 статус если нет токена и нет userid checkRefreshToken
})

securityDevisesRouter.delete('/devices', checkRefreshToken, async (req: Request, res: Response) => {
    //console.log(req.deviceId)
    await devicesService.deleteDeviceExpectCurrent(req.user!._id.toString(),req.deviceId!.toString() )
    res.sendStatus(204)

//подцепить миддлвару
//dlete current deviceId
// -> deviceService.deleteExceptThisOne(userId, currentDeviceId)-> deviceRepo.deleteMany({userId, не currentDeviceId} )
})

securityDevisesRouter.delete('/devices/:id', checkRefreshToken,
    async (req: Request, res: Response) => {
        const deviceId = req.params.id
        const status = await devicesService.deleteDevicesById(deviceId, req.user!._id.toString())
        return res.sendStatus(status)
        // if (isDeleted) {
        //     res.sendStatus(204)
        // } else res.sendStatus(404) //подцепить миддлару с проверкой
        //
        // If try to delete the deviceId of other user -найти девайс по девайс если его нет 404, вытащить юзер ид и сравнить юзер
        //ид у девайся с юзер ид в токене если они не равны кинуть 403
//-> deviceService-> deleteDeviceById
    })

