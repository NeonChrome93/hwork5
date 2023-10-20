import {type} from "os";
import mongoose, {Schema} from "mongoose";



export type ApiType = {
    ip: string,
    URL: string,
    date: Date
}

const ApiSchema = new mongoose.Schema<ApiType>({
    ip: {type: String, required: true},
    URL: {type: String, required: true},
    date: {type: Date, default: new Date}

})

export const ApiModel = mongoose.model<mongoose.Schema<ApiType>>("requestApi", ApiSchema )
