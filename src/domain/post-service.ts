import {createPostType, PostViewType, PostType, UpdatePostType} from "../models/posts-models/post-models";
import {blogRepository} from "../repositories/blogs/blogs-repository-database";
import {postRepository} from "../repositories/posts/posts-repository-database";
import {QueryPaginationType} from "../middlewares/pagination";
import {PaginationModels} from "../models/pagination/pagination-models";
import {REACTIONS_ENUM} from "../models/comments-models/comments-models";
import e from "express";
import {usersRepository} from "../repositories/users/users-repository-database";


export class PostService {

    // async readPosts(pagination: QueryPaginationType): Promise<PaginationModels<PostOutputType[]>> {
    //     return postRepository.readPosts(pagination)
    // }
    //
    // async readPostId(postId: string) {
    //     return postRepository.readPostId(postId)
    // }

    async createPost(input: createPostType) {
        const blog = await blogRepository.readBlogsId(input.blogId)
        if (!blog) return null
        const newPost: PostType = {
            ...input,
            blogName: blog.name,
            createdAt: new Date().toISOString()
        }
        return postRepository.createPost(newPost)
    }

    async addLikesByPost(postId: string, userId: string, status: REACTIONS_ENUM): Promise<boolean> {
        let post = await postRepository.readPostId(postId)
        let user = await usersRepository.readUserById(userId.toString())
        if (!post) return false
        const reactions = post.reactions.find(r => r.userId == userId)

        if (!reactions) {

            post.reactions.push({ userId, status, createdAt: new Date(), login: user!.login})
console.log('reaction:',post.reactions[0])
        } else {
           //reactions.userId = userId
           reactions.createdAt = new Date()
           reactions.status = status
           post.reactions.map((r) => r.userId === userId ? {...r, ...reactions} : r )
            // Таким образом, строка кода обновляет массив реакций комментария,
            //     заменяя существующую реакцию пользователя на новую реакцию, если идентификаторы пользователей совпадают.

        }
        await postRepository.updatePostReaction(post)
        return true
    }

    async updatePosts(postId: string, newUpdateRequest: UpdatePostType): Promise<boolean> {
        let post = await postRepository.readPostId(postId)
        if (!post) return false
        return postRepository.updatePosts(postId, newUpdateRequest)

    }

    async deletePosts(postId: string) {


        let post = await postRepository.readPostId(postId)
        if (!post) return false
        return postRepository.deletePosts(postId)
    }

}

export const postService = new PostService()
