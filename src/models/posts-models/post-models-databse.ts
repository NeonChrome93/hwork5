import {WithId} from "mongodb";
import {BlogsType} from "../blogs-models/blogs-models-database";

export type PostType = {

    "title": string,
    "shortDescription": string,
    "content": string,
    "blogId": string,
    "blogName": string,
    "createdAt": string
}

export type PostOutputType = {
    "id": string,
    "title": string,
    "shortDescription": string,
    "content": string,
    "blogId": string,
    "blogName": string,
    "createdAt": string
}

export type mongoTypePost = WithId<PostType>

export type createPostType = {
    "title": string,
    "shortDescription": string,
    "content": string,
    "blogId": string

}

export type UpdatePostType = {
    "title": string,
    "shortDescription": string,
    "content": string,
    "blogId": string,
}