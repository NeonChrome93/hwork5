import {devicesRepository} from "../repositories/devices/devices-repository";

export const devicesService = {


    async createDevice(ip: string, id: string, userid:string, title: string, lastActiveDate: string) {
        const device = {
            ip: ip,
            deviceId: id,
            userId: userid,
            title: title,
            lastActiveDate: lastActiveDate

        }
        await devicesRepository.createDevice(device)

    },
    async deleteDeviceById(deviceId: string){
       // await devicesRepository.deleteById(deviceId)
        return;
    }


}
