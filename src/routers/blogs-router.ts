import {Request, Response, Router } from "express";
import {blogRepository} from "../repositories/blogs/blogs-repository-database";
import {authGuardMiddleware} from "../middlewares/auth";
import {validationCreateUpdateBlog} from "../middlewares/blogs-validation";
import {BlogsType} from "../models/blogs-models/blogs-models-database";
import {getQueryPagination} from "../middlewares/pagination";
import {postsRepository} from "../repositories/posts/posts-repository-database";


export const blogsRouter = Router({})

blogsRouter.get('/', async (req: Request, res: Response) => {
    const pagination = getQueryPagination(req.query)
    const arr = await blogRepository.readBlogs(pagination);
    res.status(200).send(arr);
})

//pagination get

blogsRouter.get('/:id', async (req: Request, res: Response) => {
    const blogId = req.params.id
    let foundId = await blogRepository.readBlogsId(blogId);
    if (foundId) {
        res.status(200).send(foundId)
    } else res.sendStatus(404)
})

blogsRouter.get('/:id/posts', async (req: Request, res: Response) => {
    const blogId = req.params.id
    const pagination = getQueryPagination(req.query)
    const blog = await blogRepository.readBlogsId(blogId)
    if(!blog) return res.sendStatus(404)
    const arr = await postsRepository.readPostsByBlogId(blogId, pagination);
    return res.status(200).send(arr)

})

blogsRouter.post('/:id/posts', async (req: Request, res: Response) => {
    const blogId = req.params.id
    const blog = await blogRepository.readBlogsId(blogId)
    if(!blog) return res.sendStatus(404)
    const {title, shortDescription, content} = req.body
    const post = await postsRepository.createPost({title, shortDescription, content, blogId});
    return res.status(201).send(post)

})


 blogsRouter.post('/',
    authGuardMiddleware,
    ...validationCreateUpdateBlog,
     async (req: Request, res: Response) => {
    const newPosts : BlogsType = await blogRepository.createBlog(req.body)
    res.status(201).send(newPosts)


})

blogsRouter.put('/:id',
    authGuardMiddleware,
    ...validationCreateUpdateBlog,
async (req: Request, res: Response) => {
    const postId = req.params.id
    let postUpdate = await blogRepository.updateBlogs(postId, req.body)
    if (postUpdate) {
        res.sendStatus(204)
    } else res.sendStatus(404)

})

blogsRouter.delete('/:id',
    authGuardMiddleware,
    async (req: Request, res: Response) => {
    const postId = req.params.id
    const isDeleted = await blogRepository.deleteBlogs(postId)
    if (isDeleted) {
        res.sendStatus(204);
    } else res.sendStatus(404)
})
//
// blogsRouter.delete('/', (req: Request, res: Response) => {
//     blogRepository.deleteAllBlogs()
//     res.sendStatus(204)
// })