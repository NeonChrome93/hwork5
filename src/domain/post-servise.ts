import {createPostType, PostOutputType, PostType, UpdatePostType} from "../models/posts-models/post-models-databse";
import {blogRepository} from "../repositories/blogs/blogs-repository-database";
import {postsRepository} from "../repositories/posts/posts-repository-database";
import {QueryPaginationType} from "../middlewares/pagination";
import {PaginationModels} from "../models/pagination/pagination-models";


export const postServise = {

    async readPosts(pagination: QueryPaginationType): Promise<PaginationModels<PostOutputType[]>> {
        return postsRepository.readPosts(pagination)
    },

    async readPostId(postId: string) {
        return postsRepository.readPostId(postId)
    },

    async createPost(input: createPostType) {
        const blog = await blogRepository.readBlogsId(input.blogId)
        if (!blog) return null
        const newPost: PostType = {
            ...input,
            blogName: blog.name,
            createdAt: new Date().toISOString()
        }
        return postsRepository.createPost(newPost)
    },

    async updatePosts(postId: string, newUpdateRequest: UpdatePostType): Promise<boolean> {
        let post = await postsRepository.readPostId(postId)
        if(!post) return false
        return  postsRepository.updatePosts(postId,newUpdateRequest)

    },

    async deletePosts(postId: string) {
        let post = await postsRepository.readPostId(postId)
        if(!post) return false
        return  postsRepository.deletePosts(postId)
    }




}
