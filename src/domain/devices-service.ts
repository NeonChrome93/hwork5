import {devicesRepository} from "../repositories/devices/devices-repository";
import {devicesCollection} from "../db/database";
import {UserDbModel} from "../models/users-models/user.models";
import {usersRepository} from "../repositories/users/users-repository-database";
import {DevicesDBType} from "../models/devices-models";

export const devicesService = {


    async createDevice(ip: string, id: string, userid: string, title: string, lastActiveDate: string) :Promise<DevicesDBType> {
        const device = {
            ip: ip,
            deviceId: id,
            userId: userid,
            title: title,
            lastActiveDate: lastActiveDate

        }
       return  await devicesRepository.createDevice(device)


    },

    async findDeviceById(deviceId: string): Promise<DevicesDBType | null> {
        return await devicesRepository.findDevice(deviceId)
    },

    async deleteDeviceExpectCurrent(userId: string, deviceId: string) {

        return await devicesRepository.deleteDeviceExpectCurrent(userId, deviceId)
    },


    async deleteDevicesById(deviceId: string, userId: string): Promise<204 | 403| 404>   {
        const device = await devicesRepository.findDevice(deviceId)
        if (!device) return 404
        if(device.userId !== userId) return 403
        await devicesRepository.deleteDevicesById(deviceId)
        return 204

        // return await devicesRepository.deleteDevicesById(deviceId)

    }


}
