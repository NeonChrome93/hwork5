import {QueryPaginationType} from "../../middlewares/pagination";
import {FilterQuery} from "mongoose";
import {CommentModel, CommentsDBType} from "../../domain/entities/comments-entity";
import {CommentsViewType, REACTIONS_ENUM} from "../../models/comments-models/comments-models";
import {ObjectId} from "mongodb";

class CommentsQueryRepository {

    async readCommentByPostId(postId: string, pagination: QueryPaginationType, userId?: string | null) {
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
            createdAt: c.createdAt.toISOString(),
            likesInfo: {
                likesCount: c.reactions.filter(r => r.status === REACTIONS_ENUM.Like).length,
                dislikesCount: c.reactions.filter(r => r.status === REACTIONS_ENUM.Dislike).length,
                myStatus: userId ?
                    (c.reactions.filter(r => r.userId === userId).length ? c.reactions.filter(r => r.userId === userId)[0].status : REACTIONS_ENUM.None)
                    : REACTIONS_ENUM.None
            }
        }))

        const pagesCount = Math.ceil(totalCount / pagination.pageSize);
        return {
            pagesCount: pagesCount === 0 ? 1 : pagesCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount,
            items
        }
    }

    async readCommentId(id: string, userId?: string | null ): Promise<CommentsViewType | null> {

        const comment: CommentsDBType | null = await CommentModel.findOne({_id: new ObjectId(id)})

        if (!comment) {
            return null
        }
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: comment.commentatorInfo,
            createdAt: comment.createdAt.toISOString(),
            likesInfo: {
                likesCount: comment.reactions.filter(r => r.status === REACTIONS_ENUM.Like).length,
                dislikesCount: comment.reactions.filter(r => r.status === REACTIONS_ENUM.Dislike).length,
                myStatus: userId ?
                    (comment.reactions.filter(r => r.userId === userId).length ? comment.reactions.filter(r => r.userId === userId)[0].status : REACTIONS_ENUM.None)
                    : REACTIONS_ENUM.None


            }
        }
    }
}

export const commentsQueryRepository = new CommentsQueryRepository()