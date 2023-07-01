import {createPostType, postType, updatePostType} from "../models/post-models";
import {db} from "../db/db";
import {randomUUID} from "crypto";


export const postsRepository = {

    readPosts() {

        return db.posts

    },


    readPostId(postId: string) {
        let findId = db.posts.find(p => p.id === postId)
        return findId

    },

    createPost(newPostFromRequest: createPostType) {
        const newId = randomUUID().toString();
        const blog = db.blogs.find(b => b.id === newPostFromRequest.blogId)
        if(!blog) return false
        const newPost: postType = {
            id: newId,
            title: newPostFromRequest.title,
            shortDescription: newPostFromRequest.shortDescription,
            content: newPostFromRequest.content,
            blogId: newPostFromRequest.blogId,
            blogName: blog.name,
        }
        db.posts.push(newPost)
        return newPost
    },

    updatePosts(postId: string, newUpdateRequest: updatePostType) {
        let postUpdate = db.posts.find(p => p.id === postId)
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
        const deletePost = db.posts.find(el => el.id === postId)
        if (deletePost) {
            db.posts = db.posts.filter(el => el.id !== deletePost.id);
            return true;
        } else return false

    },

    deleteAllPosts() {
        db.posts = [];
        return true
    }

}