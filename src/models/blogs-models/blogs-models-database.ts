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
        "websiteUrl": "https://BUVWX92pD98RaWgA2Pfp.mnHdP4UQzM.VpHJH3Km6XESXjcc88RsTtI24bRhL1qST5tAOELsb2h35cPDBoAFK0WBVMKy"
    }

export type UpdateBlogType =
    {
        "name": string,
        "description": string,
        "websiteUrl": "https://BUVWX92pD98RaWgA2Pfp.mnHdP4UQzM.VpHJH3Km6XESXjcc88RsTtI24bRhL1qST5tAOELsb2h35cPDBoAFK0WBVMKy"
    }
