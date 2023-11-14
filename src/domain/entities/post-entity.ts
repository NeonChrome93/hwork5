import {ObjectId} from "mongodb";
import mongoose from "mongoose";
import {PostType} from "../../models/posts-models/post-models";
import {BlogDbType} from "./blog-entity";

export type postDbType = {
    _id: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: Date,

}



const postSchema = new mongoose.Schema<postDbType>({
    title : {type: String, require: true},
    shortDescription: {type: String, require: true},
    content: {type: String, required: true},
    blogId: {type: String, require: true},
    blogName: {type: String, require: true},
    createdAt: {type: Date, default: new Date},

})
//..

export const PostModel = mongoose.model<mongoose.Schema<postDbType>>('posts', postSchema)