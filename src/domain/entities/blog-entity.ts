import mongoose from "mongoose";
import {Blog} from "../../models/blogs-models/blogs-models";
import {ObjectId} from "mongodb";

export type BlogDbType = {
    _id: ObjectId,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: Date,
    isMembership: boolean
}





const blogSchema = new mongoose.Schema<BlogDbType>({
    name: {type: String, require: true},
    description: {type: String, require: true},
    websiteUrl: {type: String, require: true},
    createdAt: {type: Date, default: new Date},
    isMembership: {type: Boolean, default: false}

})
//..

export const BlogModel = mongoose.model<mongoose.Schema<BlogDbType>>('blogs', blogSchema)