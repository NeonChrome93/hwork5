
import {blogsType, createBlogType, updateBlogType} from "../../models/blogs-models";
import {randomUUID} from "crypto";
import {blogCollection, } from "../../db/database";




    //todo also update blogName in posts
    // updateBlog(updateBlogDto){
 export const blogRepository = {

    async readBlogs(){

       // let  start = performance.now()
        //while (performance.now() - start < 10000){
        //    console.log(performance.now() - start)
       // }

        return  blogCollection.find({}, {projection: {_id: false}}).toArray()

    },


    async readBlogsId (id: string) {
        // let findId = dbLocal.blogs.find(b => b.id === id)
        // return findId
        // return (await client.db('test').collections<blogsType>('blogs')).find(b => b.id === id).toArray()
        return blogCollection.findOne({id: id}, {projection: {_id: false}})
    },

    async createBlog (newBlogFromRequest: createBlogType) : Promise<blogsType> {
        const newId = randomUUID()
        const dateNow = new Date()
        const newBlog: blogsType = {
            id: newId,
            name: newBlogFromRequest.name,
            description: newBlogFromRequest.description,
            websiteUrl: newBlogFromRequest.websiteUrl,
            createdAt: dateNow.toISOString(),
            isMembership: true
        }
        //TODO save in database
        // dbLocal.blogs.push(newBlog)
        await blogCollection.insertOne({...newBlog})
        return newBlog
    },

   async updateBlogs(id: string ,newUpdateRequest :updateBlogType) : Promise<boolean> {
        let blogUpdate = await blogCollection.findOne({id: id}, {projection: {_id: false}})
        if (blogUpdate) {
            // blogUpdate.name = newUpdateRequest.name,
            // blogUpdate.description = newUpdateRequest.description,
            // blogUpdate.websiteUrl = newUpdateRequest.websiteUrl
            await blogCollection.updateMany({id: id}, { $set: {name: newUpdateRequest.name,
                    description: newUpdateRequest.description, websiteUrl: newUpdateRequest.websiteUrl }
            }
                  )
            return true
        } else {
            return false
        }
    },


    async deleteBlogs(id: string) {
        const filter = {id: id}
        const deleteBlog = await blogCollection.findOne(filter)
        if (deleteBlog) {
            await blogCollection.deleteOne(filter)
            return true;
        } else return false

    },

    async deleteAllBlogs() {
        // dbLocal.blogs = [];
        await blogCollection.deleteMany({})
        return true
    }

}