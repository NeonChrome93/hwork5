import {postType} from "../models/post-models";
import {blogsType} from "../models/blogs-models";

type dbType = {
    blogs: blogsType[],
    posts: postType[]
}

export const db: dbType = {
    blogs: [],
    posts: [],
}