import {createPostType, postType, updatePostType} from "../../models/post-models";
import {dbLocal} from "../../db/db-local";
import {randomUUID} from "crypto";


export const postsRepository = {

    readPosts() {

        return dbLocal.posts

    },


     readPostId(postId: string) {
        let findId = dbLocal.posts.find(p => p.id === postId)
        return findId

    },

     createPost(newPostFromRequest: createPostType) {
        const newId = randomUUID().toString();
         const dateNow = new Date()
        const blog = dbLocal.blogs.find(b => b.id === newPostFromRequest.blogId)
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
        dbLocal.posts.push(newPost)
        return newPost
    },

    updatePosts(postId: string, newUpdateRequest: updatePostType) {
        let postUpdate = dbLocal.posts.find(p => p.id === postId)
        if (postUpdate) {
            postUpdate.title = newUpdateRequest.title
                postUpdate.shortDescription = newUpdateRequest.shortDescription
                postUpdate.content = newUpdateRequest.content
                postUpdate.blogId = newUpdateRequest.blogId
            return true
        } else {     
            return false
        }
    },


    deletePosts(postId: string) {
        const deletePost = dbLocal.posts.find(el => el.id === postId)
        if (deletePost) {
            dbLocal.posts = dbLocal.posts.filter(el => el.id !== deletePost.id);
            return true;
        } else return false

    },

    deleteAllPosts() {
        dbLocal.posts = [];
        return true
    }

}