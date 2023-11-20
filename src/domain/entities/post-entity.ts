import {ObjectId} from "mongodb";
import mongoose from "mongoose";
import {PostType} from "../../models/posts-models/post-models";
import {BlogDbType} from "./blog-entity";

import {REACTIONS_ENUM} from "../../models/comments-models/comments-models";
import e from "express";

export type postDbType = {
    _id: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: Date,
    reactions: StatusType[]

}

 export type StatusType = {
    userId: string,
     login:string,
    createdAt: Date,
    status: REACTIONS_ENUM
}

const statusSchema = new mongoose.Schema<StatusType>({
    userId: {type: String, required: true},
    login: {type: String, required: true},
    createdAt: {type: Date, default: new Date},
    status: {type: String, required: true, enum: REACTIONS_ENUM}
})


const postSchema = new mongoose.Schema<postDbType>({
    title : {type: String, require: true},
    shortDescription: {type: String, require: true},
    content: {type: String, required: true},
    blogId: {type: String, require: true},
    blogName: {type: String, require: true},
    createdAt: {type: Date, default: new Date},
    reactions: {default: [], type: [statusSchema]}

})
//..

export const PostModel = mongoose.model<mongoose.Schema<postDbType>>('posts', postSchema)