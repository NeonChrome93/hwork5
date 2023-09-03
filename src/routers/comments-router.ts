import {Request, Response, Router} from "express";
import {commentServise} from "../domain/comments-servise";
import {authMiddleware} from "../middlewares/auth";
import {contentValidation} from "../middlewares/validations/content-validation";
import {commentRepository} from "../repositories/comments/comments-repository-database";
import {isCommentOwnerMiddleware} from "../middlewares/comment-info";

export const commentsRouter = Router({})


commentsRouter.get('/:id', async (req: Request, res: Response) => {
    const commentId = req.params.id
    let foundId = await commentServise.readCommentId(commentId)
    if (foundId) {
        res.status(200).send(foundId)
    } else res.sendStatus(404)

})

commentsRouter.put('/:id', contentValidation ,authMiddleware, isCommentOwnerMiddleware, async (req: Request, res: Response) => {

    const commentId = req.params.id
    let foundId = await commentServise.updateComment(commentId, req.body)
    if (foundId) {
        res.status(204).send(foundId)
    } else res.sendStatus(404) //CheckOwner

})

commentsRouter.delete('/:id'  ,authMiddleware, isCommentOwnerMiddleware, async (req: Request, res: Response) =>{
    const commentId = req.params.id
    let isDeleted = await commentServise.deleteComment(commentId)
    if (isDeleted) {
        res.sendStatus(204)
    } else res.sendStatus(404)
})