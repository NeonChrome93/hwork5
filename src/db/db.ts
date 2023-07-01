import {postType} from "../models/post-models";
import {blogsType} from "../models/blogs-models";

type dbType = {
    blogs: blogsType[],
    posts: postType[]
}

export const db: dbType = {
    blogs: [ {
        "id": "59c9060b-2186-4144-b7f0-20aa09de2a0d",
        "name": "Yaroslaw",
        "description": "blabla",
        "websiteUrl": "https://N6nObd4K-LO9OrmtA_P8zSOUYkUzHAgSEIP7Fbwytyse3wl-4.ElB.zds4B-w.Dychq0viLrocgbNJkKSnk_mO2UI-UX"
    }],
    posts: [{
        "id": "473f03b0-4979-4798-afec-9feedac657cf",
        "title": "Cook",
        "shortDescription": "Kitchen",
        "content": "Reciepe",
        "blogId": "59c9060b-2186-4144-b7f0-20aa09de2a0d",
        "blogName": "Yaroslaw"
    }],
}