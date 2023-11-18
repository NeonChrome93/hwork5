import {createPostType, PostOutputType, PostType, UpdatePostType} from "../models/posts-models/post-models";
import {blogRepository} from "../repositories/blogs/blogs-repository-database";
import {postRepository} from "../repositories/posts/posts-repository-database";
import {QueryPaginationType} from "../middlewares/pagination";
import {PaginationModels} from "../models/pagination/pagination-models";


export class PostService  {

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

    async updatePosts(postId: string, newUpdateRequest: UpdatePostType): Promise<boolean> {
        let post = await postRepository.readPostId(postId)
        if(!post) return false
        return  postRepository.updatePosts(postId,newUpdateRequest)

    }

    async deletePosts(postId: string) {


        let post = await postRepository.readPostId(postId)
        if(!post) return false
        return  postRepository.deletePosts(postId)
    }

}

export const postService = new PostService()
