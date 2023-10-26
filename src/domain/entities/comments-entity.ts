import {ObjectId} from "mongodb";
import mongoose from "mongoose";
import {BlogDbType} from "./blog-entity";


export type CommentsDBType = {
    _id: ObjectId
    postId: string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    }
    createdAt: Date
}

const commentsSchema = new mongoose.Schema<CommentsDBType>({
    postId: {type: String, required: true},
    content: {type: String, required: true},
    commentatorInfo: {
        userId:  {type: String, required: true},
        userLogin:  {type: String, required: true},
    },
    createdAt: {type: Date, default: new Date}

})

export const CommentModel = mongoose.model<mongoose.Schema<CommentsDBType>>("comments", commentsSchema )