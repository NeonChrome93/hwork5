import {CommentsDBType, CommentsViewType, UpdateCommentType} from "../models/comments-models/comments-models";
import {ObjectId} from "mongodb";
import {commentRepository} from "../repositories/comments/comments-repository-database";



export const commentServise = {

    // async readComment(pagination: QueryPaginationType): Promise<PaginationModels<PostOutputType[]>> {
    //     return commentRepository.readCommentId()
    // },

    async readCommentId(commentId: string) {
        return commentRepository.readCommentId(commentId)
    },




    async createComment(postId: string, userId: string, userLogin: string, content: string): Promise<CommentsViewType> {
        const newComment: CommentsDBType = {
            _id: new ObjectId(),
            postId,
            content,
            commentatorInfo: {
                userId,
                userLogin
            },
            createdAt: new Date().toISOString()
        }
        await commentRepository.createComment(newComment)
        return {
            id: newComment._id.toString(),
            content,
            commentatorInfo: newComment.commentatorInfo,
            createdAt: newComment.createdAt
        }
    },


    async updateComment(commentId: string, newUpdateRequest: UpdateCommentType): Promise<boolean> {
        let comment = await commentRepository.readCommentId(commentId)
        if(!comment ) return false
        return  commentRepository.updateComment(commentId,newUpdateRequest)

    },


    async deleteComment(commentId: string): Promise<boolean> {
        let comment = await commentRepository.readCommentId(commentId)
        if(!comment) return false
        return  commentRepository.deleteComment(commentId)
    },
}