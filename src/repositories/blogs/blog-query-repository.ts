import {QueryPaginationType} from "../../middlewares/pagination";
import {PaginationModels} from "../../models/pagination/pagination-models";
import {BlogsOutputType} from "../../models/blogs-models/blogs-models";
import {FilterQuery} from "mongoose";
import {BlogDbType, BlogModel} from "../../domain/entities/blog-entity";
import {ObjectId} from "mongodb";


class BlogQueryRepository  {
    async readBlogs(pagination: QueryPaginationType): Promise<PaginationModels<BlogsOutputType[]>> {

        const filter: FilterQuery<BlogDbType> = {name: {$regex: pagination.searchNameTerm, $options: 'i'}}



        const blogs = await BlogModel
            .find(filter, null, {lean: true})
            .sort({[pagination.sortBy]: pagination.sortDirection})
            .skip(pagination.skip)
            .limit(pagination.pageSize)
            .exec()

        const totalCount = await BlogModel.countDocuments(filter).exec()
        const items: BlogsOutputType[] = blogs.map((b) => ({
            id: b._id.toString(),
            name: b.name,
            description: b.description,
            websiteUrl: b.websiteUrl,
            createdAt: b.createdAt.toISOString(),
            isMembership: b.isMembership

        }))
        const pagesCount = Math.ceil(totalCount / pagination.pageSize);
        return {
            pagesCount: pagesCount === 0 ? 1 : pagesCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount: totalCount,
            items
        }
    }

    async readBlogsId(id: string): Promise<BlogsOutputType | null> {
        const blog = await BlogModel.findOne({_id: new ObjectId(id)}).exec()//logic

        if (!blog) {
            return null;
        }

        return {
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt.toISOString(),
            isMembership: blog.isMembership
        }
    }

}

export const blogQueryRepository = new BlogQueryRepository()