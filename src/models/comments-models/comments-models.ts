import {ObjectId} from "mongodb";

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

export type CreateCommentType = {
    content: string
}

export type UpdateCommentType = {
    content: string
}

export type CommentsViewType = {
    id: string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    }
    createdAt: string
}