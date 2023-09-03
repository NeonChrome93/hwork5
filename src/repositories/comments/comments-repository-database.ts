import {QueryPaginationType} from "../../middlewares/pagination";
import {commentsCollection} from "../../db/database";
import {Filter, ObjectId} from "mongodb";
import {
    CommentsDBType,
    CommentsViewType,
    UpdateCommentType
} from "../../models/comments-models/comments-models";



export const commentRepository = {

    async readCommentByPostId(postId: string, pagination: QueryPaginationType) {
        const filter: Filter<CommentsDBType> = {postId}
        const comments = await commentsCollection
            .find(filter)
            .sort({[pagination.sortBy]: pagination.sortDirection})
            .skip(pagination.skip)
            .limit(pagination.pageSize)
            .toArray()

        const totalCount = await commentsCollection.countDocuments(filter)
        const items: CommentsViewType[] = comments.map((c: CommentsDBType) => ({
            id: c._id.toString(),
            content: c.content,
            commentatorInfo: c.commentatorInfo,
            createdAt: c.createdAt
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

        const comment: CommentsDBType | null = await commentsCollection.findOne({_id: new ObjectId(id)})

        if (!comment) {
            return null
        }
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: comment.commentatorInfo,
            createdAt: comment.createdAt
        }
    },

    async createComment(newComment: CommentsDBType): Promise<boolean> {

        await commentsCollection.insertOne({...newComment})
        return true
    },

    async updateComment(commentId: string, newUpdateRequest: UpdateCommentType): Promise<boolean> {

        const res = await commentsCollection.updateOne({_id: new ObjectId(commentId)}, {
                $set: {content: newUpdateRequest.content}
            }
        )
        return res.matchedCount === 1;
    },

    async deleteComment(commentId: string) {
        try {
            const filter = {_id: new ObjectId(commentId)}
            const res = await commentsCollection.deleteOne(filter)
            return res.deletedCount === 1;
        } catch (e) {
            return false
        }
    },

    async deleteAllComments(): Promise<boolean> {
        // dbLocal.blogs = [];
        await commentsCollection.deleteMany({})
        return true
    }
}