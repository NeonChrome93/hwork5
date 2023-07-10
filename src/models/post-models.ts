export type postType = {
    "id": string,
    "title": string,
    "shortDescription": string,
    "content": string,
    "blogId": string,
    "blogName": string,
    "createdAt": string
}

export type createPostType = {
    "title": string,
    "shortDescription": string,
    "content": string,
    "blogId": string,
}

export type updatePostType = {
    "title": string,
    "shortDescription": string,
    "content": string,
    "blogId": string,
}