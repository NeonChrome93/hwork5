import {DevicesDBType, DeviceViewModel} from "../../models/devices-models";
import {devicesCollection} from "../../db/database";
import {Filter} from "mongodb";
import {CommentsDBType} from "../../models/comments-models/comments-models";

export const devicesRepository = {

    async createDevice(device: DevicesDBType) :Promise<DevicesDBType> {
        await devicesCollection.insertOne({...device})
        return device
    },

    async findDevice(deviceId: string): Promise<DevicesDBType | null> {
        return  await devicesCollection.findOne({deviceId})
    },

    async findAllUserDevices(userId: string) :Promise<DeviceViewModel[]>{
        return  devicesCollection.find({userId}, {projection: {_id: 0, userId: 0}}).toArray()
    },

    async deleteDeviceExpectCurrent( userId: string,deviceId: string): Promise<boolean> {
        const res = await devicesCollection.deleteMany({ userId: userId, deviceId: { $ne: deviceId}})
        return res.acknowledged
    },

    async deleteDevicesById(deviceId: string): Promise<boolean> {
        const res = await devicesCollection.deleteOne({deviceId: deviceId})
        return res.acknowledged

    },





}