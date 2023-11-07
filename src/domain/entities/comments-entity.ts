import {ObjectId} from "mongodb";
import mongoose from "mongoose";
import {BlogDbType} from "./blog-entity";
import {REACTIONS_ENUM} from "../../models/comments-models/comments-models";


export type CommentsDBType = {
    _id: ObjectId
    postId: string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    }
    createdAt: Date
    reactions: StatusType[]
}

export type StatusType = {
    userId: string,
    createdAt: Date,
    status: REACTIONS_ENUM
}

const statusSchema = new mongoose.Schema<StatusType>({
    userId: {type: String, required: true},
    createdAt: {type: Date, default: new Date},
    status: {type: String, required: true, enum: REACTIONS_ENUM}
})

const commentsSchema = new mongoose.Schema<CommentsDBType>({
    postId: {type: String, required: true},
    content: {type: String, required: true},
    commentatorInfo: {
        userId: {type: String, required: true},
        userLogin: {type: String, required: true},
    },
    createdAt: {type: Date, default: new Date},
    reactions: { default: [], type: [statusSchema]}

})

export const CommentModel = mongoose.model<mongoose.Schema<CommentsDBType>>("comments", commentsSchema)