//import { postCollection} from "../../db/database";
import {
    PostViewType,
    PostType,
    UpdatePostType
} from "../../models/posts-models/post-models";
import {Filter, ObjectId} from "mongodb";
import {QueryPaginationType} from "../../middlewares/pagination";
import {PaginationModels} from "../../models/pagination/pagination-models";
import {postDbType, PostModel} from "../../domain/entities/post-entity";
import {FilterQuery} from "mongoose";
import {CommentsDBType} from "../../domain/entities/comments-entity";
import {REACTIONS_ENUM} from "../../models/comments-models/comments-models";


export class PostRepository {

    // async readPosts(pagination: QueryPaginationType): Promise<PaginationModels<PostOutputType[]>> {
    //
    //     const posts = await PostModel
    //         .find({})
    //         .sort({[pagination.sortBy]: pagination.sortDirection})
    //         .skip(pagination.skip)
    //         .limit(pagination.pageSize)
    //         .exec()
    //
    //     const totalCount = await PostModel.countDocuments().exec()
    //     const items :PostOutputType[] = posts.map((p) => ({
    //         id: p._id.toString(),
    //         title: p.title,
    //         shortDescription: p.shortDescription,
    //         content: p.content,
    //         blogId: p.blogId,
    //         blogName: p.blogName,
    //         createdAt: p.createdAt.toISOString()
    //
    //     }))
    //     const pagesCount = Math.ceil(totalCount / pagination.pageSize);
    //     return {
    //         pagesCount: pagesCount === 0 ? 1 : pagesCount,
    //         page: pagination.pageNumber,
    //         pageSize: pagination.pageSize,
    //         totalCount,
    //         items
    //     }

    //}


    async readPostId(postId: string): Promise<postDbType | null> {
        if (!ObjectId.isValid(postId)) return null
        return PostModel.findOne({_id: new ObjectId(postId)});

        // if (!post) {
        //     return null;
        // }
        //
        // return {
        //     id: post._id,
        //     title: post.title,
        //     shortDescription: post.shortDescription,
        //     content: post.content,
        //     blogId: post.blogId,
        //     blogName: post.blogName,
        //     createdAt: post.createdAt
        //
        // }
    }

    async createPost(newPost: PostType): Promise<PostViewType> {

        const res = new PostModel(newPost)
        await res.save()
        return {
            id: res._id.toString(),
            ...newPost,
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: REACTIONS_ENUM.None,
                newestLikes: []
            }
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

    async updatePostReaction(post: postDbType) {
        return PostModel.updateOne({_id: post._id}, {
            $set: {...post}
        })
    }

    async deletePosts(postId: string): Promise<boolean> {

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


}

export const postRepository = new PostRepository()