import {DevicesDBType, DeviceViewModel} from "../../models/devices-models";
//import {commentsCollection, devicesCollection} from "../../db/database";
import {DeviceModel} from "../../domain/entities/devices-entity"
import {Filter, ObjectId} from "mongodb";
import {CommentsDBType, UpdateCommentType} from "../../models/comments-models/comments-models";
import {BlogModel} from "../../domain/entities/blog-entity";

export const devicesRepository = {

    async createDevice(device: DevicesDBType) :Promise<DevicesDBType> {
        //await deviceModel.create(device)
        const _device = new DeviceModel(device)
        await _device.save()
        return device
    },

    async findDevice(deviceId: string): Promise<DevicesDBType | null> {
        return DeviceModel.findOne({deviceId})
    },

    async findAllUserDevices(userId: string) :Promise<DeviceViewModel[]>{
        return  DeviceModel.find({userId}, {projection: {_id: 0, userId: 0}}).lean()
    },

    async updateDeviceLastActiveDate(deviceId: string ,lastActiveDate: string): Promise<boolean> {

        const res = await DeviceModel.updateOne({deviceId: deviceId}, {
                $set: {lastActiveDate: lastActiveDate}
            }
        ).exec()
        return res.matchedCount === 1;
    },

    async deleteDeviceExpectCurrent( userId: string,deviceId: string): Promise<boolean> {
        const res = await DeviceModel.deleteMany({ userId: userId, deviceId: { $ne: deviceId}}).exec()
        return res.acknowledged
    },

    async deleteDevicesById(deviceId: string): Promise<boolean> {
        const res = await DeviceModel.deleteOne({deviceId: deviceId}).exec()
        return res.acknowledged

    },





}