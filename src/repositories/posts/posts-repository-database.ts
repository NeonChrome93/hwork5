
import {blogCollection, postCollection} from "../../db/database";
import {
    createPostType,
    PostOutputType,
    PostType,
    UpdatePostType
} from "../../models/posts-models/post-models-databse";
import {Filter, ObjectId} from "mongodb";
import {blogRepository} from "../blogs/blogs-repository-database";
import {QueryPaginationType} from "../../middlewares/pagination";
import {PaginationModels} from "../../models/pagination-models";


export const postsRepository = {

   async readPosts(pagination: QueryPaginationType): Promise<PaginationModels<PostOutputType[]>> {

       const posts = await postCollection
           .find({})
           .sort({[pagination.sortBy]: pagination.sortDirection})
           .skip(pagination.skip)
           .limit(pagination.pageSize)
           .toArray()

       const totalCount = await postCollection.countDocuments()
       const items = posts.map((p) => ({
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


   },


    async readPostId(postId: string) {
        const post = await postCollection.findOne({_id: new ObjectId(postId)});

        if(!post){
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
    },

    async createPost(newPostFromRequest: createPostType) :Promise <PostOutputType | boolean> {
       // const newId = randomUUID()
        const dateNow = new Date()


        const blog = await blogRepository.readBlogsId(newPostFromRequest.blogId);
        if(!blog){
            return false;
        }
        const newPost: PostType = {

            title: newPostFromRequest.title,
            shortDescription: newPostFromRequest.shortDescription,
            content: newPostFromRequest.content,
            blogId: blog.id.toString(),
            blogName: blog.name,
            createdAt: dateNow.toISOString()
        }
        const res = await postCollection.insertOne({...newPost});
        return  {
            id: res.insertedId.toString(),
            ...newPost
        }
    },

    async updatePosts(postId: string, newUpdateRequest: UpdatePostType) :Promise<boolean> {
        let postUpdate = await this.readPostId(postId);//await postCollection.findOne({id: postId}, {projection: {_id: false}})
        if (postUpdate) { //ry
            // postUpdate.title = newUpdateRequest.title
            //     postUpdate.shortDescription = newUpdateRequest.shortDescription
            //     postUpdate.content = newUpdateRequest.content
            //     postUpdate.blogId = newUpdateRequest.blogId
            const res = await postCollection.updateOne({_id: new ObjectId(postId)}, {
                $set: {
                    title: newUpdateRequest.title, shortDescription: newUpdateRequest.shortDescription,
                    content: newUpdateRequest.content, blogId: newUpdateRequest.blogId
                }
            } )
            return res.matchedCount === 1;
        } else {
            return false
        }
    },


    async deletePosts(postId: string) {
        const filter = {_id: new ObjectId(postId)}
        const deletePost = await postCollection.findOne(filter)
        if (deletePost) {
          try {
              const res = await postCollection.deleteOne(filter)
              return res.deletedCount === 1;
          } catch (e) { return false}
        } else return false

    },

    async deleteAllPosts() {
        await postCollection.deleteMany({});
        return true
    },

    async readPostsByBlogId(blogId: string, pagination: QueryPaginationType) {
       const filter: Filter<PostType> = { blogId }
        const posts = await postCollection
            .find(filter)
            .sort({[pagination.sortBy]: pagination.sortDirection})
            .skip(pagination.skip)
            .limit(pagination.pageSize)
            .toArray()

        const totalCount = await postCollection.countDocuments(filter)
        const items = posts.map((p) => ({
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