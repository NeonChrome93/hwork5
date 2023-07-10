
import {randomUUID} from "crypto";
import {blogCollection, postCollection} from "../../db/database";
import {dbLocal} from "../../db/db-local";
import {createPostType, postType, updatePostType} from "../../models/post-models";


export const postsRepository = {

   async readPosts() {

        return postCollection.find({}, {projection: {_id: false}}).toArray()

    },


    async readPostId(postId: string) {
         return postCollection.findOne({id: postId }, {projection: {_id: false}})

    },

    async createPost(newPostFromRequest: createPostType) :Promise <createPostType | boolean> {
        const newId = randomUUID()
        const dateNow = new Date()
        const blog = await blogCollection.findOne({id: newPostFromRequest.blogId}, {projection: {_id: false}})
        if(!blog) return false
        const newPost: postType = {
            id: newId,
            title: newPostFromRequest.title,
            shortDescription: newPostFromRequest.shortDescription,
            content: newPostFromRequest.content,
            blogId: newPostFromRequest.blogId,
            blogName: blog.name,
            createdAt: dateNow.toISOString()
        }
        await postCollection.insertOne({...newPost})
        return newPost
    },

    async updatePosts(postId: string, newUpdateRequest: updatePostType) :Promise<boolean> {
        let postUpdate = await postCollection.findOne({id: postId}, {projection: {_id: false}})
        if (postUpdate) {
            // postUpdate.title = newUpdateRequest.title
            //     postUpdate.shortDescription = newUpdateRequest.shortDescription
            //     postUpdate.content = newUpdateRequest.content
            //     postUpdate.blogId = newUpdateRequest.blogId
            await postCollection.updateOne({id: postId}, {
                $set: {
                    title: newUpdateRequest.title, shortDescription: newUpdateRequest.shortDescription,
                    content: newUpdateRequest.content, blogId: newUpdateRequest.blogId
                }
            } )
            return true
        } else {     
            return false
        }
    },


    async deletePosts(postId: string) {
        const filter = {id: postId}
        const deletePost = await postCollection.findOne(filter)
        if (deletePost) {
           await postCollection.deleteOne(filter)
            return true;
        } else return false

    },

    async deleteAllPosts() {
        await postCollection.deleteMany({});
        return true
    }

}