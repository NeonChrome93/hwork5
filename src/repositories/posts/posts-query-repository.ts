import {QueryPaginationType} from "../../middlewares/pagination";
import {PaginationModels} from "../../models/pagination/pagination-models";
import {PostOutputType} from "../../models/posts-models/post-models";
import {PostModel} from "../../domain/entities/post-entity";
import {ObjectId} from "mongodb";


class PostsQueryRepository {
    async readPosts(pagination: QueryPaginationType): Promise<PaginationModels<PostOutputType[]>> {

        const posts = await PostModel
            .find({})
            .sort({[pagination.sortBy]: pagination.sortDirection})
            .skip(pagination.skip)
            .limit(pagination.pageSize)
            .exec()

        const totalCount = await PostModel.countDocuments().exec()
        const items: PostOutputType[] = posts.map((p) => ({
            id: p._id.toString(),
            title: p.title,
            shortDescription: p.shortDescription,
            content: p.content,
            blogId: p.blogId,
            blogName: p.blogName,
            createdAt: p.createdAt.toISOString()

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

    async readPostId(postId: string) {
        const post = await PostModel.findOne({_id: new ObjectId(postId)}).exec();

        if (!post) {
            return null;
        }

        return {
            id: post._id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt

        }
    }
}

export const postsQueryRepository = new PostsQueryRepository()