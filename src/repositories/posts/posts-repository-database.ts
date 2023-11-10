//import { postCollection} from "../../db/database";
import {
    PostOutputType,
    PostType,
    UpdatePostType
} from "../../models/posts-models/post-models";
import {Filter, ObjectId} from "mongodb";
import {QueryPaginationType} from "../../middlewares/pagination";
import {PaginationModels} from "../../models/pagination/pagination-models";
import {postDbType, PostModel} from "../../domain/entities/post-entity";
import {FilterQuery} from "mongoose";


export class PostRepository {

    async readPosts(pagination: QueryPaginationType): Promise<PaginationModels<PostOutputType[]>> {

        const posts = await PostModel
            .find({})
            .sort({[pagination.sortBy]: pagination.sortDirection})
            .skip(pagination.skip)
            .limit(pagination.pageSize)
            .exec()

        const totalCount = await PostModel.countDocuments().exec()
        const items :PostOutputType[] = posts.map((p) => ({
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

    async createPost(newPost: PostType): Promise<PostOutputType> {

        const res = new PostModel(newPost)
        await res.save()
        return {
            id: res._id.toString(),
            ...newPost
        }
    }

    async updatePosts(postId: string, newUpdateRequest: UpdatePostType): Promise<boolean> {

            const res = await PostModel.updateOne({_id: new ObjectId(postId)}, {
                $set: {
                    title: newUpdateRequest.title, shortDescription: newUpdateRequest.shortDescription,
                    content: newUpdateRequest.content, blogId: newUpdateRequest.blogId
                }
            }).exec()
            return res.matchedCount === 1;

    }

    async deletePosts(postId: string) {

            try {
                const filter = {_id: new ObjectId(postId)}
                const res = await PostModel.deleteOne(filter).exec()
                return res.deletedCount === 1;
            } catch (e) {
                return false
            }


    }

    async deleteAllPosts() {
        await PostModel.deleteMany({});
        return true
    }

    async readPostsByBlogId(blogId: string, pagination: QueryPaginationType) {
        const filter: FilterQuery<PostType> = {blogId}
        const posts = await PostModel
            .find(filter)
            .sort({[pagination.sortBy]: pagination.sortDirection})
            .skip(pagination.skip)
            .limit(pagination.pageSize)
            .exec()

        const totalCount = await PostModel.countDocuments(filter).exec()
        const items  = posts.map((p:postDbType) => ({
            id: p._id.toString(),
            title: p.title,
            shortDescription: p.shortDescription,
            content: p.content,
            blogId: p.blogId,
            blogName: p.blogName,
            createdAt: p.createdAt

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
}

export const postRepository = new PostRepository()