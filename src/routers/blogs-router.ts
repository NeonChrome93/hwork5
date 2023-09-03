import {Request, Response, Router } from "express";
import {blogsServise} from "../domain/blogs-servise";
import {authGuardMiddleware} from "../middlewares/auth";
import {validationCreateUpdateBlog} from "../middlewares/validations/blogs-validation";
import {BlogsType} from "../models/blogs-models/blogs-models";
import {getQueryPagination} from "../middlewares/pagination";
import {postsRepository} from "../repositories/posts/posts-repository-database";
import {validationCreatePostWithoutBlogId} from "../middlewares/validations/post-withoutBlogId-validation";
import {postServise} from "../domain/post-servise";


export const blogsRouter = Router({})

blogsRouter.get('/', async (req: Request, res: Response) => {
    const pagination = getQueryPagination(req.query)
    const arr = await blogsServise.readBlogs(pagination);
    res.status(200).send(arr);
})

//pagination get

blogsRouter.get('/:id', async (req: Request, res: Response) => {
    const blogId = req.params.id
    let foundId = await blogsServise.readBlogsId(blogId);
    if (foundId) {
        res.status(200).send(foundId)
    } else res.sendStatus(404)
})

blogsRouter.get('/:id/posts', async (req: Request, res: Response) => {
    const blogId = req.params.id
    const pagination = getQueryPagination(req.query)
    const blog = await blogsServise.readBlogsId(blogId)
    if(!blog) return res.sendStatus(404)
    const arr = await postsRepository.readPostsByBlogId(blogId, pagination); //servis
    return res.status(200).send(arr)

})

blogsRouter.post('/:id/posts',
    authGuardMiddleware,
    ...validationCreatePostWithoutBlogId,
    async (req: Request, res: Response) => {
    const blogId = req.params.id
       const post = await postServise.createPost({...req.body, blogId})
   //const post = await postsRepository.createPost({...req.body, blogId});
    if(!post) return res.sendStatus(404)
    return res.status(201).send(post)

})


 blogsRouter.post('/',
    authGuardMiddleware,
    ...validationCreateUpdateBlog,
     async (req: Request, res: Response) => {
    const newPosts : BlogsType = await blogsServise.createBlog(req.body)
    res.status(201).send(newPosts)


})

blogsRouter.put('/:id',
    authGuardMiddleware,
    ...validationCreateUpdateBlog,
async (req: Request, res: Response) => {
    const postId = req.params.id
    let postUpdate = await blogsServise.updateBlogs(postId, req.body)
    if (postUpdate) {
        res.sendStatus(204)
    } else res.sendStatus(404)

})

blogsRouter.delete('/:id',
    authGuardMiddleware,
    async (req: Request, res: Response) => {
    const postId = req.params.id
    const isDeleted = await blogsServise.deleteBlogs(postId)
    if (isDeleted) {
        res.sendStatus(204);
    } else res.sendStatus(404)
})
//
// blogsRouter.delete('/', (req: Request, res: Response) => {
//     blogRepository.deleteAllBlogs()
//     res.sendStatus(204)
// })