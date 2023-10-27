import {QueryPaginationType} from "../../middlewares/pagination";
//import {commentsCollection} from "../../db/database";

import {Filter, ObjectId} from "mongodb";
import {
    CommentsDBType,
    CommentsViewType,
    UpdateCommentType
} from "../../models/comments-models/comments-models";
import {CommentModel} from "../../domain/entities/comments-entity";
import {FilterQuery} from "mongoose";



export const commentRepository = {

    async readCommentByPostId(postId: string, pagination: QueryPaginationType) {
        const filter: FilterQuery<CommentsDBType> = {postId}
        const comments = await CommentModel
            .find(filter)
            .sort({[pagination.sortBy]: pagination.sortDirection})
            .skip(pagination.skip)
            .limit(pagination.pageSize)
            .exec()

        const totalCount = await CommentModel.countDocuments(filter).exec()
        const items: CommentsViewType[] = comments.map((c: CommentsDBType) => ({
            id: c._id.toString(),
            content: c.content,
            commentatorInfo: c.commentatorInfo,
            createdAt: c.createdAt.toISOString()
        }))

        const pagesCount = Math.ceil(totalCount / pagination.pageSize);
        return {
            pagesCount: pagesCount === 0 ? 1 : pagesCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount,
            items
        }
    },

    async readCommentId(id: string): Promise<CommentsViewType | null> {

        const comment: CommentsDBType | null = await CommentModel.findOne({_id: id})

        if (!comment) {
            return null
        }
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: comment.commentatorInfo,
            createdAt: comment.createdAt.toISOString()
        }
    },

    async createComment(newComment: CommentsDBType): Promise<boolean> {

        await CommentModel.create({...newComment})
        return true
    },

    async updateComment(commentId: string, newUpdateRequest: UpdateCommentType): Promise<boolean> {

        const res = await  CommentModel.updateOne({_id: new ObjectId(commentId)}, {
                $set: {content: newUpdateRequest.content}
            }
        ).exec()

        return res.matchedCount === 1;
    },

    async deleteComment(commentId: string): Promise<boolean> {
        try {
            const filter = {_id: new ObjectId(commentId)}
            const res = await  CommentModel.deleteOne(filter).exec()
            return res.deletedCount === 1;
        } catch (e) {
            return false
        }
    },

    async deleteAllComments(): Promise<boolean> {
        // dbLocal.blogs = [];
        await  CommentModel.deleteMany({})
        return true
    }
}