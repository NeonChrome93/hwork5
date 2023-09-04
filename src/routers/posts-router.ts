import {Request, Response, Router} from "express";
import {validationCreateUpdatePost} from "../middlewares/validations/post-validation";
import {authGuardMiddleware, authMiddleware} from "../middlewares/auth";
import {getQueryPagination} from "../middlewares/pagination";
import {postServise} from "../domain/post-servise";
import {commentServise} from "../domain/comments-servise";
import {commentRepository} from "../repositories/comments/comments-repository-database";
import {contentValidation} from "../middlewares/validations/content-validation";


export const postsRouter = Router({})

postsRouter.get('/:postId/comments', async (req: Request, res: Response) => {
    const postId = req.params.postId

    const pagination = getQueryPagination(req.query)
    const comment = await commentRepository.readCommentByPostId(postId, pagination)
    if(!comment) return res.sendStatus(404)
    return res.status(200).send(comment)

})


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


postsRouter.post('/:postId/comments',  authMiddleware, ...contentValidation, async (req: Request, res: Response) => {
    const post = await postServise.readPostId(req.params.postId)
    if(!post) return res.sendStatus(404)

    const userId = req.user!._id.toString()
    const userLogin = req.user!.login
    const newComment = await commentServise.createComment(post.id.toString(), userId, userLogin, req.body.content)
    return res.status(201).send(newComment)
})

// postsRouter.delete('/', (req: Request, res: Response) => {
//     postsRepository.deleteAllShops()
//     res.sendStatus(204)
// })