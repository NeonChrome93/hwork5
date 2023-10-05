import {DevicesDBType, DeviceViewModel} from "../../models/devices-models";
import {commentsCollection, devicesCollection} from "../../db/database";
import {Filter, ObjectId} from "mongodb";
import {CommentsDBType, UpdateCommentType} from "../../models/comments-models/comments-models";

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

    async updateDeviceLastActiveDate(deviceId: string ,lastActiveDate: string): Promise<boolean> {

        const res = await devicesCollection.updateOne({deviceId: deviceId}, {
                $set: {lastActiveDate: lastActiveDate}
            }
        )
        return res.matchedCount === 1;
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