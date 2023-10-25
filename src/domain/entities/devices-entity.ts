import mongoose from "mongoose";


export type DevicesDBType = {
    ip: string,
    deviceId: string,
    userId: string,
    title: string,
    lastActiveDate: string

}

const devicesSchema = new mongoose.Schema<DevicesDBType>({
    ip: {type: String, required: true},
    deviceId: {type: String, required: true},
    userId: {type: String, required: true},
    title: {type: String, required: true},
    lastActiveDate: {type: String, required: true}

})

export const DeviceModel = mongoose.model<mongoose.Schema<DevicesDBType>>('devices', devicesSchema)