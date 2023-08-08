import {Request, Response, Router} from "express";
import {postsRepository} from "../repositories/posts/posts-repository-database";
import {validationCreateUpdatePost} from "../middlewares/post-validation";
import {authGuardMiddleware} from "../middlewares/auth";
import {getQueryPagination} from "../middlewares/pagination";
import {blogRepository} from "../repositories/blogs/blogs-repository-database";
import {postServise} from "../domain/post-servise";


export const postsRouter = Router({})


postsRouter.get('/', async (req: Request, res: Response) => {
    const pagination = getQueryPagination(req.query);
    const arr = await postServise.readPosts(pagination);
    res.status(200).send(arr);
})

postsRouter.get('/:id', async (req: Request, res: Response) => {
    const postId = req.params.id
    console.log(postId)
    let foundId = await postServise.readPostId(postId);
    if (foundId) {
        res.send(foundId)
    } else res.sendStatus(404)

})

postsRouter.post('/',
    authGuardMiddleware,
    ...validationCreateUpdatePost,
    async (req: Request, res: Response) => {
        const newPosts = await postServise.createPost(req.body)
        if (!newPosts) return res.sendStatus(400)
        res.status(201).send(newPosts)


    })

postsRouter.put('/:id',
    authGuardMiddleware,
    ...validationCreateUpdatePost,
    async (req: Request, res: Response) => {
        const postId = req.params.id
        let postUpdate = await postServise.updatePosts(postId, req.body)
        if (postUpdate) {
            res.sendStatus(204)
        } else res.sendStatus(404)

    })

postsRouter.delete('/:id',
    authGuardMiddleware,
    async (req: Request, res: Response) => {
        const postId = req.params.id
        const isDeleted = await postServise.deletePosts(postId)
        if (isDeleted) {
            res.sendStatus(204);
        } else res.sendStatus(404)
    })

// postsRouter.delete('/', (req: Request, res: Response) => {
//     postsRepository.deleteAllShops()
//     res.sendStatus(204)
// })