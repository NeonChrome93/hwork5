
import {blogsOutputType, BlogsType, createBlogType, mongoType, updateBlogType} from "../../models/blogs-models/blogs-models-database";
import {randomUUID} from "crypto";
import {blogCollection, } from "../../db/database";
import {ObjectId} from "mongodb";




    //todo also update blogName in posts
    // updateBlog(updateBlogDto){
 export const blogRepository = {

    async readBlogs(): Promise<blogsOutputType[]> {

        // let  start = performance.now()
        // while (performance.now() - start < 10000){
        // console.log(performance.now() - start)
        // }
        const blogs = await blogCollection.find({}).toArray();

        return blogs.map((b) => {
            return {
                id: b._id.toString(),
                name: b.name,
                description: b.description,
                websiteUrl: b.websiteUrl,
                createdAt: b.createdAt,
                isMembership: b.isMembership
            }
        })

    },


    async readBlogsId (id: string) {
        // let findId = dbLocal.blogs.find(b => b.id === id)
        // return findId
        // return (await client.db('test').collections<blogsType>('blogs')).find(b => b.id === id).toArray()
        const blog = await blogCollection.findOne({_id: new ObjectId(id)});

        if(!blog){
            return null;
        }

        return {
            id: blog._id,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        }
    },

    async createBlog (newBlogFromRequest: createBlogType) : Promise<blogsOutputType> {
        //const newId = randomUUID()
        const dateNow = new Date()
        const newBlog: BlogsType = {

            name: newBlogFromRequest.name,
            description: newBlogFromRequest.description,
            websiteUrl: newBlogFromRequest.websiteUrl,
            createdAt: dateNow.toISOString(),
            isMembership: false //false Swagger
        }//add mapping
        //TODO save in database
        const res = await blogCollection.insertOne({...newBlog});
        return  {
            id: res.insertedId.toString(),
            ...newBlog
        }

    },


   async updateBlogs(id: string ,newUpdateRequest :updateBlogType) : Promise<boolean> {
        let blogUpdate: mongoType | null = await blogCollection.findOne({_id: new ObjectId(id)})

        if (blogUpdate) {
            // blogUpdate.name = newUpdateRequest.name,
            // blogUpdate.description = newUpdateRequest.description,
            // blogUpdate.websiteUrl = newUpdateRequest.websiteUrl
            const res = await blogCollection.updateOne({_id: new ObjectId(id)}, { $set: {name: newUpdateRequest.name,
                    description: newUpdateRequest.description, websiteUrl: newUpdateRequest.websiteUrl }
            }
                  )
            return res.matchedCount === 1;
        } else {
            return false
        }
    },


    async deleteBlogs(id: string) : Promise<boolean>{
        const filter = {_id: new ObjectId(id)}
        const deleteBlog = await blogCollection.findOne(filter)
        if (deleteBlog) {
           try { await blogCollection.deleteOne(filter) }
            catch (e){
               return false
            }
            return true;
        } else return false

    },

    async deleteAllBlogs(): Promise<boolean> {
        // dbLocal.blogs = [];
        await blogCollection.deleteMany({})
        return true
    }

}