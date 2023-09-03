import {WithId} from "mongodb";


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