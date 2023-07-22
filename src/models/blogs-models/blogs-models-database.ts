import {WithId} from "mongodb";

export type BlogsType =
    {
        "name": string,
        "description": string,
        "websiteUrl": string,
        "createdAt": string,
        "isMembership": boolean
    }
export type BlogsOutputType =
    {    "id": string,
        "name": string,
        "description": string,
        "websiteUrl": string,
        "createdAt": string,
        "isMembership": boolean
    }

 export type mongoType = WithId<BlogsType>

export type CreateBlogType =
    {
        "name": string,
        "description": string,
        "websiteUrl": string
    }

export type UpdateBlogType =
    {
        "name": string,
        "description": string,
        "websiteUrl": string
    }
