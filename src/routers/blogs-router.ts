import {Request, Response, Router } from "express";
import {blogRepository} from "../repositories/blogs-repository";
import {authGuardMiddleware} from "../middlewares/auth";
import {validationCreateUpdateBlog} from "../middlewares/blogs-validation";


export const blogsRouter = Router({})

blogsRouter.get('/', (req: Request, res: Response) => {
    let arr = blogRepository.readBlogs();
    res.send(arr);
})

blogsRouter.get('/:id', (req: Request, res: Response) => {
    const blogId = req.params.id
    let foundId = blogRepository.readBlogsId(blogId);
    if (foundId) {
        res.send(foundId)
    } else res.sendStatus(404)

})

blogsRouter.post('/',
    authGuardMiddleware,
    ...validationCreateUpdateBlog,

    (req: Request, res: Response) => {
    const newPosts = blogRepository.createBlog(req.body)
    res.status(201).send(newPosts)


})

blogsRouter.put('/:id',
    authGuardMiddleware,
    ...validationCreateUpdateBlog,
(req: Request, res: Response) => {
    const postId = req.params.id
    let postUpdate = blogRepository.updateBlogs(postId, req.body)
    if (postUpdate) {
        res.sendStatus(204)
    } else res.sendStatus(404)

})

blogsRouter.delete('/:id',
    authGuardMiddleware,
    (req: Request, res: Response) => {
    const postId = req.params.id
    const isDeleted = blogRepository.deleteBlogs(postId)
    if (isDeleted) {
        res.sendStatus(204);
    } else res.sendStatus(404)
})
//
// blogsRouter.delete('/', (req: Request, res: Response) => {
//     blogRepository.deleteAllBlogs()
//     res.sendStatus(204)
// })