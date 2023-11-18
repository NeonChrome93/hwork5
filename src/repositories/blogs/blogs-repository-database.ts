import {
    BlogsOutputType,
    Blog,
    UpdateBlogType
} from "../../models/blogs-models/blogs-models";
import {BlogDbType, BlogModel} from "../../domain/entities/blog-entity"
import {ObjectId} from "mongodb";
import {FilterQuery, UpdateQuery} from "mongoose";
import {QueryPaginationType} from "../../middlewares/pagination";
import {PaginationModels} from "../../models/pagination/pagination-models";


//todo also update blogName in posts
// updateBlog(updateBlogDto){

class BlogRepository {

    // async readBlogs(pagination: QueryPaginationType): Promise<PaginationModels<BlogsOutputType[]>> {
    //
    //     const filter: FilterQuery<BlogDbType> = {name: {$regex: pagination.searchNameTerm, $options: 'i'}}
    //
    //
    //
    //     const blogs = await BlogModel
    //         .find(filter, null, {lean: true})
    //         .sort({[pagination.sortBy]: pagination.sortDirection})
    //         .skip(pagination.skip)
    //         .limit(pagination.pageSize)
    //         .exec()
    //
    //     const totalCount = await BlogModel.countDocuments(filter).exec()
    //     const items: BlogsOutputType[] = blogs.map((b) => ({
    //         id: b._id.toString(),
    //         name: b.name,
    //         description: b.description,
    //         websiteUrl: b.websiteUrl,
    //         createdAt: b.createdAt.toISOString(),
    //         isMembership: b.isMembership
    //
    //     }))
    //     const pagesCount = Math.ceil(totalCount / pagination.pageSize);
    //     return {
    //         pagesCount: pagesCount === 0 ? 1 : pagesCount,
    //         page: pagination.pageNumber,
    //         pageSize: pagination.pageSize,
    //         totalCount: totalCount,
    //         items
    //     }
    // }


    async readBlogsId(id: string) {
       return await BlogModel.findOne({_id: new ObjectId(id)}).exec()//only for logic for services

    }

    async createBlog(newBlog: Blog): Promise<BlogsOutputType> {
        //const newId = randomUUID()
        // const dateNow = new Date()
        // const newBlog: BlogsType = {
        //
        //     name: newBlogFromRequest.name,
        //     description: newBlogFromRequest.description,
        //     websiteUrl: newBlogFromRequest.websiteUrl,
        //     createdAt: dateNow.toISOString(),
        //     isMembership: false //false Swagger
        // }//add mapping
        //TODO save in database

        const _blog = new BlogModel(newBlog)
        console.log(_blog)
        await _blog.save();

        return {
            id: _blog._id.toString(),
            ...newBlog
        }

    }


    async updateBlogs(id: string, newUpdateRequest: UpdateBlogType): Promise<boolean> {

        // blogUpdate.name = newUpdateRequest.name,
        // blogUpdate.description = newUpdateRequest.description,
        // blogUpdate.websiteUrl = newUpdateRequest.websiteUrl
        const res = await BlogModel.updateOne({_id: new ObjectId(id)}, {
                $set: {
                    name: newUpdateRequest.name,
                    description: newUpdateRequest.description, websiteUrl: newUpdateRequest.websiteUrl
                }
            }
        ).exec()
        return res.matchedCount === 1

    }


    async deleteBlogs(id: string): Promise<boolean> {

        try {
            const filter = {_id: id}
            const res = await BlogModel.deleteOne(filter).exec()
            return res.deletedCount === 1
        } catch (e) {
            return false
        }

    }

    async deleteAllBlogs(): Promise<boolean> {
        // dbLocal.blogs = [];
        await BlogModel.deleteMany({})
        return true
    }

}

export const blogRepository = new BlogRepository()