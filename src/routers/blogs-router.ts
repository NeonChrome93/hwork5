import {Request, Response, Router } from "express";
import {blogRepository} from "../repositories/blogs/blogs-repository-database";
import {authGuardMiddleware} from "../middlewares/auth";
import {validationCreateUpdateBlog} from "../middlewares/blogs-validation";
import {BlogsType} from "../models/blogs-models/blogs-models-database";


export const blogsRouter = Router({})

blogsRouter.get('/', async (req: Request, res: Response) => {
    let arr = await blogRepository.readBlogs();
    res.status(200).send(arr);
})

blogsRouter.get('/:id', async (req: Request, res: Response) => {
    const blogId = req.params.id
    let foundId = await blogRepository.readBlogsId(blogId);
    if (foundId) {
        res.status(200).send(foundId)
    } else res.sendStatus(404)
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