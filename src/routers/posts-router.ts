import {Request, Response, Router} from "express";
import {validationCreateUpdatePost} from "../middlewares/validations/post-validation";
import {authGuardMiddleware, authMiddleware, authSoftMiddleware} from "../middlewares/auth";
import {getQueryPagination} from "../middlewares/pagination";
import {postService} from "../domain/post-service";
import {commentService} from "../domain/comments-serviсe";
import {commentRepository} from "../repositories/comments/comments-repository-database";
import {contentValidation} from "../middlewares/validations/content-validation";


export const postsRouter = Router({})

class PostController {

    async getPosts(req: Request, res: Response) {
        const pagination = getQueryPagination(req.query);
        const arr = await postService.readPosts(pagination);
        res.status(200).send(arr);
    }

    async getPostById(req: Request, res: Response) {
        const postId = req.params.id;
        console.log(postId);
        let foundId = await postService.readPostId(postId);
        if (foundId) {
            res.send(foundId);
        } else res.sendStatus(404);
    }

    async createPosts(req: Request, res: Response) {
        const newPosts = await postService.createPost(req.body);
        if (!newPosts) return res.sendStatus(400);
        res.status(201).send(newPosts);
    }

    async updatePost(req: Request, res: Response) {
        const postId = req.params.id;
        let postUpdate = await postService.updatePosts(postId, req.body);
        if (postUpdate) {
            res.sendStatus(204);
        } else res.sendStatus(404);
    }


    async deletePost(req: Request, res: Response) {
        const postId = req.params.id;
        const isDeleted = await postService.deletePosts(postId);
        if (isDeleted) {
            res.sendStatus(204);
        } else res.sendStatus(404);
    }

    async getCommentByPostId(req: Request, res: Response) {
        const userId = req.userId
        const postId = req.params.postId;
        const pagination = getQueryPagination(req.query);
        const post = await postService.readPostId(postId);
        if (!post) {
            return res.sendStatus(404);
        }
        const comment = await commentRepository.readCommentByPostId(postId, pagination, userId ? userId : null);
        if (!comment) return res.sendStatus(404);
        return res.status(200).send(comment);
    }

    async createCommentByPostId(req: Request, res: Response) {
        const post = await postService.readPostId(req.params.postId);
        if (!post) return res.sendStatus(404);

        const userId = req.user!._id.toString();
        const userLogin = req.user!.login;
        const newComment = await commentService.createComment(post.id.toString(), userId, userLogin, req.body.content);
        return res.status(201).send(newComment);
    }

}

const postControllerInstance = new PostController();

postsRouter.get('/', postControllerInstance.getPosts)

postsRouter.get('/:id', postControllerInstance.getPostById)

postsRouter.post('/',
    authGuardMiddleware,
    ...validationCreateUpdatePost, postControllerInstance.createPosts)

postsRouter.put('/:id',
    authGuardMiddleware,
    ...validationCreateUpdatePost,postControllerInstance.updatePost)

postsRouter.delete('/:id',
    authGuardMiddleware,postControllerInstance.deletePost)

postsRouter.get('/:postId/comments',authSoftMiddleware, postControllerInstance.getCommentByPostId)

postsRouter.post('/:postId/comments',
    authMiddleware,
    ...contentValidation, postControllerInstance.createCommentByPostId)


// postsRouter.get('/', async (req: Request, res: Response) => {
//     const pagination = getQueryPagination(req.query);
//     const arr = await postService.readPosts(pagination);
//     res.status(200).send(arr);
// })
//
// postsRouter.get('/:id', async (req: Request, res: Response) => {
//     const postId = req.params.id
//     console.log(postId)
//     let foundId = await postService.readPostId(postId);
//     if (foundId) {
//         res.send(foundId)
//     } else res.sendStatus(404)
//
// })
//
// postsRouter.post('/',
//     authGuardMiddleware,
//     ...validationCreateUpdatePost,
//     async (req: Request, res: Response) => {
//         const newPosts = await postService.createPost(req.body)
//         if (!newPosts) return res.sendStatus(400)
//         res.status(201).send(newPosts)
//
//
//     })
//
// postsRouter.put('/:id',
//     authGuardMiddleware,
//     ...validationCreateUpdatePost,
//     async (req: Request, res: Response) => {
//         const postId = req.params.id
//         let postUpdate = await postService.updatePosts(postId, req.body)
//         if (postUpdate) {
//             res.sendStatus(204)
//         } else res.sendStatus(404)
//
//     })
//
// postsRouter.delete('/:id',
//     authGuardMiddleware,
//     async (req: Request, res: Response) => {
//         const postId = req.params.id
//         const isDeleted = await postService.deletePosts(postId)
//         if (isDeleted) {
//             res.sendStatus(204);
//         } else res.sendStatus(404)
//     })
//
// postsRouter.get('/:postId/comments', async (req: Request, res: Response) => {
//     const postId = req.params.postId
//
//     const pagination = getQueryPagination(req.query)
//     const post = await postService.readPostId(postId)
//     if (!post) {
//         return res.sendStatus(404)
//     }
//     const comment = await commentRepository.readCommentByPostId(postId, pagination)
//     if (!comment) return res.sendStatus(404)
//     return res.status(200).send(comment)
//
// })
//
// postsRouter.post('/:postId/comments', authMiddleware, ...contentValidation, async (req: Request, res: Response) => {
//     const post = await postService.readPostId(req.params.postId)
//     if (!post) return res.sendStatus(404)
//
//     const userId = req.user!._id.toString()
//     const userLogin = req.user!.login
//     const newComment = await commentService.createComment(post.id.toString(), userId, userLogin, req.body.content)
//     return res.status(201).send(newComment)
// })

// postsRouter.delete('/', (req: Request, res: Response) => {
//     postsRepository.deleteAllShops()
//     res.sendStatus(204)
// })