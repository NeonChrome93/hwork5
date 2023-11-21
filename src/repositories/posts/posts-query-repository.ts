import {QueryPaginationType} from "../../middlewares/pagination";
import {PaginationModels} from "../../models/pagination/pagination-models";
import {NewestLikeType, PostViewType} from "../../models/posts-models/post-models";
import {postDbType, PostModel, StatusType} from "../../domain/entities/post-entity";
import {ObjectId} from "mongodb";
import {REACTIONS_ENUM} from "../../models/comments-models/comments-models";


class PostsQueryRepository {
    async readPosts(pagination: QueryPaginationType, userId?: string | null): Promise<PaginationModels<PostViewType[]>> {
        //const filter: FilterQuery<CommentsDBType> = {postId}
        const posts = await PostModel
            .find({})
            .sort({[pagination.sortBy]: pagination.sortDirection})
            .skip(pagination.skip)
            .limit(pagination.pageSize)
            .exec()

        const totalCount = await PostModel.countDocuments().exec()

        const items: PostViewType[] = posts.map((p: postDbType) => {


            const result = {
                id: p._id.toString(),
                title: p.title,
                shortDescription: p.shortDescription,
                content: p.content,
                blogId: p.blogId,
                blogName: p.blogName,
                createdAt: p.createdAt.toISOString(),
                extendedLikesInfo: {
                    likesCount: p.reactions.filter(r => r.status === REACTIONS_ENUM.Like).length,
                    dislikesCount: p.reactions.filter(r => r.status === REACTIONS_ENUM.Dislike).length,
                    myStatus: userId ?
                        (p.reactions.filter(r => r.userId === userId).length ? p.reactions.filter(r => r.userId === userId)[0].status : REACTIONS_ENUM.None)
                        : REACTIONS_ENUM.None,
                    newestLikes: [] as NewestLikeType[]
                }

            }

            if(result.extendedLikesInfo.likesCount){
                const newestLikes =  p.reactions.reduce((acc: NewestLikeType[] , r: StatusType):  NewestLikeType[] => {
                    if(r.status === REACTIONS_ENUM.Like){
                        acc.push({
                            addedAt: r.createdAt.toISOString(),
                            userId: r.userId,
                            login: r.login

                        } );
                    }
                    return acc
                }, [] as NewestLikeType[]).sort((a, b) => new Date(b.addedAt).getTime()  - new Date(a.addedAt).getTime())
                if(newestLikes.length > 3){
                    result.extendedLikesInfo.newestLikes.push(newestLikes[0], newestLikes[1], newestLikes[2])
                } else {
                    result.extendedLikesInfo.newestLikes.push(...newestLikes)
                }
            }

            return result;
            }
        )
        const pagesCount = Math.ceil(totalCount / pagination.pageSize);
        return {
            pagesCount: pagesCount === 0 ? 1 : pagesCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount,
            items
        }
    }

    async readPostId(postId: string, userId?: string | null):Promise<PostViewType | null> {

        const post :postDbType | null  = await PostModel.findOne({_id: new ObjectId(postId)});

        if (!post) {
            return null;
        }

        const result = {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt.toISOString(),
            extendedLikesInfo: {
                likesCount: post.reactions.filter(r => r.status === REACTIONS_ENUM.Like).length,
                dislikesCount: post.reactions.filter(r => r.status === REACTIONS_ENUM.Dislike).length,
                myStatus: userId ?
                    (post.reactions.filter(r => r.userId === userId).length ? post.reactions.filter(r => r.userId === userId)[0].status : REACTIONS_ENUM.None)
                    : REACTIONS_ENUM.None,
                newestLikes: [] as NewestLikeType[]

            }

        }

        if(result.extendedLikesInfo.likesCount){
            const newestLikes =  post.reactions.reduce((acc: NewestLikeType[] , r: StatusType):  NewestLikeType[] => {
                if(r.status === REACTIONS_ENUM.Like){
                    acc.push({
                        addedAt: r.createdAt.toISOString(),
                        userId: r.userId,
                        login: r.login,


                    } );
                }
                return acc
            }, [] as NewestLikeType[]).sort((a, b) => new Date(b.addedAt).getTime()  - new Date(a.addedAt).getTime())

            if(newestLikes.length > 3){
                result.extendedLikesInfo.newestLikes.push(newestLikes[0], newestLikes[1], newestLikes[2])
            } else {
                result.extendedLikesInfo.newestLikes.push(...newestLikes)
            }
        }

        return result;
    }
}

export const postsQueryRepository = new PostsQueryRepository()