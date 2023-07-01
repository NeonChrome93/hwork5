import {db} from "../db/db";
import {blogsType, createBlogType, updateBlogType} from "../models/blogs-models";
import {randomUUID} from "crypto";



    //todo also update blogName in posts
    // updateBlog(updateBlogDto){
export const blogRepository = {

    readBlogs() {

        return db.blogs

    },


    readBlogsId (id: string) {
        let findId = db.blogs.find(b => b.id === id)
        return findId

    },

    createBlog (newBlogFromRequest: createBlogType) {
        const newId = randomUUID().toString();

        const newBlog: blogsType = {
            id: newId,
            name: newBlogFromRequest.name,
            description: newBlogFromRequest.description,
            websiteUrl: newBlogFromRequest.websiteUrl
        }
        db.blogs.push(newBlog)
        return newBlog
    },

    updateBlogs(id: string ,newUpdateRequest :updateBlogType) {
        let blogUpdate = db.blogs.find(b => b.id === id)
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
        const deleteBlog = db.blogs.find(el => el.id === id)
        if (deleteBlog) {
            db.blogs = db.blogs.filter(el => el.id !== deleteBlog.id);
            return true;
        } else return false

    },

    deleteAllBlogs() {
        db.blogs = [];
        return true
    }

}