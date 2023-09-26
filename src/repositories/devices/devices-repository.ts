import {DevicesDBType} from "../../models/devices-models";
import {devicesCollection} from "../../db/database";

export const devicesRepository = {

    async createDevice(device: DevicesDBType) {
       return  await devicesCollection.insertOne(device)
    },

    async findDevice(deviceId: string) {
        return  await devicesCollection.findOne({deviceId})
    }


}