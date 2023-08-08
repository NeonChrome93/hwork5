import {blogRepository} from "../repositories/blogs/blogs-repository-database";
import {
    BlogsOutputType,
    BlogsType,
    CreateBlogType,
    mongoType,
    UpdateBlogType
} from "../models/blogs-models/blogs-models-database";
import {blogCollection} from "../db/database";
import {ObjectId} from "mongodb";
import {PaginationModels} from "../models/pagination/pagination-models";
import {QueryPaginationType} from "../middlewares/pagination";


// query - get
// commands - post | put | delete


//todo also update blogName in posts
// updateBlog(updateBlogDto){
export const blogsServise = {

    async readBlogs(pagination: QueryPaginationType): Promise<PaginationModels<BlogsOutputType[]>> {
        // return blogRepository(this.readBlogs(p))
        return blogRepository.readBlogs(pagination)
    },

    async createBlog(newBlogFromRequest: CreateBlogType): Promise<BlogsOutputType> {
        const dateNow = new Date()
        const newBlog: BlogsType = {

            name: newBlogFromRequest.name,
            description: newBlogFromRequest.description,
            websiteUrl: newBlogFromRequest.websiteUrl,
            createdAt: dateNow.toISOString(),
            isMembership: false //false Swagger
        }
        return blogRepository.createBlog(newBlog)
    },


    async readBlogsId(id: string) {
        return blogRepository.readBlogsId(id)

    },


    async updateBlogs(id: string, newUpdateRequest: UpdateBlogType): Promise<boolean> {
        const blog = await blogRepository.readBlogsId(id)
        if (!blog) return false
        return blogRepository.updateBlogs(id, newUpdateRequest)
    },


    async deleteBlogs(id: string): Promise<boolean> {
        const blog = await blogRepository.readBlogsId(id)
        if (!blog) return false
        return blogRepository.deleteBlogs(id)
    }



}