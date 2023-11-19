import {DeviceViewModel} from "../../models/devices-models";
import {DeviceModel} from "../../domain/entities/devices-entity";

class DevicesQueryRepository {

    async findAllUserDevices(userId: string): Promise<DeviceViewModel[]> {
        return DeviceModel.find({userId}, {projection: {_id: 0, userId: 0}}).lean()
    }

}

export const devicesQueryRepository = new DevicesQueryRepository()