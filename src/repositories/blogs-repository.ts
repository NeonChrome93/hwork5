import {dbLocal} from "../db/db-local";
import {blogsType, createBlogType, updateBlogType} from "../models/blogs-models";
import {randomUUID} from "crypto";



    //todo also update blogName in posts
    // updateBlog(updateBlogDto){
 export const blogRepository = {

    readBlogs() {

       // let  start = performance.now()
        //while (performance.now() - start < 10000){
        //    console.log(performance.now() - start)
       // }

        return dbLocal.blogs

    },


    readBlogsId (id: string) {
        let findId = dbLocal.blogs.find(b => b.id === id)
        return findId

    },

     createBlog (newBlogFromRequest: createBlogType) : blogsType {
        const newId = randomUUID().toString();

        const newBlog: blogsType = {
            id: newId,
            name: newBlogFromRequest.name,
            description: newBlogFromRequest.description,
            websiteUrl: newBlogFromRequest.websiteUrl
        }
        //TODO save in database
        dbLocal.blogs.push(newBlog)
        return newBlog
    },

    updateBlogs(id: string ,newUpdateRequest :updateBlogType) {
        let blogUpdate = dbLocal.blogs.find(b => b.id === id)
        if (blogUpdate) {
            blogUpdate.name = newUpdateRequest.name,
            blogUpdate.description = newUpdateRequest.description,
            blogUpdate.websiteUrl = newUpdateRequest.websiteUrl
            return true
        } else {
            return false
        }
    },


    deleteBlogs(id: string) {
        const deleteBlog = dbLocal.blogs.find(el => el.id === id)
        if (deleteBlog) {
            dbLocal.blogs = dbLocal.blogs.filter(el => el.id !== deleteBlog.id);
            return true;
        } else return false

    },

    deleteAllBlogs() {
        dbLocal.blogs = [];
        return true
    }

}