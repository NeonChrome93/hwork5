import { Request, Response, Router} from "express";
import {postsRepository} from "../repositories/posts-repository";
import {validationCreateUpdatePost} from "../middlewares/post-validation";
import {authGuardMiddleware} from "../middlewares/auth";



export const postsRouter = Router({})


postsRouter.get('/', (req: Request, res: Response) => {
    let arr = postsRepository.readPosts();
    res.send(arr);
})

postsRouter.get('/:id', (req: Request, res: Response) => {
    const postId = req.params.id
    console.log(postId)
    let foundId = postsRepository.readPostId(postId);
    if (foundId) {
        res.send(foundId)
    } else res.sendStatus(404)

})

postsRouter.post('/',
    authGuardMiddleware,
    ...validationCreateUpdatePost,
     (req: Request, res: Response) => {
    const newPosts = postsRepository.createPost(req.body)
    res.status(201).send(newPosts)


})

postsRouter.put('/:id',
    authGuardMiddleware,
    ...validationCreateUpdatePost,
    (req: Request, res: Response) => {
    const postId = req.params.id
    let postUpdate = postsRepository.updatePosts(postId, req.body)
    if (postUpdate) {
        res.sendStatus(204)
    } else res.sendStatus(404)

})

postsRouter.delete('/:id',
    authGuardMiddleware,
    (req: Request, res: Response) => {
    const postId = req.params.id
    const isDeleted = postsRepository.deletePosts(postId)
    if (isDeleted) {
        res.sendStatus(204);
    } else res.sendStatus(404)
})

// postsRouter.delete('/', (req: Request, res: Response) => {
//     postsRepository.deleteAllShops()
//     res.sendStatus(204)
// })