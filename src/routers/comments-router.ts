import {Request, Response, Router} from "express";
import {commentService} from "../domain/comments-serviсe";
import {authMiddleware, getUserMiddleware} from "../middlewares/auth";
import {contentValidation} from "../middlewares/validations/content-validation";
import {commentRepository} from "../repositories/comments/comments-repository-database";
import {isCommentOwnerMiddleware} from "../middlewares/comment-info";
import {CommentModel} from "../domain/entities/comments-entity";
import {ObjectId} from "mongodb";
import {commentLikesValidation} from "../middlewares/validations/comment-likes-validation";
import {UserDbModel} from "../domain/entities/users-entity";
import {commentsQueryRepository} from "../repositories/comments/comments-query-repository";


export const commentsRouter = Router({})


commentsRouter.get('/:id', getUserMiddleware,  async (req: Request, res: Response) => {
    const userId : string | null = req.userId

    const commentId = req.params.id
    let foundId = await commentsQueryRepository.readCommentId(commentId, userId)
    if (foundId) {
        res.status(200).send(foundId)
    } else res.sendStatus(404)

})

commentsRouter.put('/:id', authMiddleware, isCommentOwnerMiddleware, ...contentValidation, async (req: Request, res: Response) => {

    const commentId = req.params.id
    let foundId = await commentService.updateComment(commentId, req.body)
    if (foundId) {
        res.status(204).send(foundId)
    } else res.sendStatus(404) //CheckOwner

})

commentsRouter.put('/:commentId/like-status', authMiddleware, ...commentLikesValidation, async (req: Request, res: Response) => {
    const user = req.user!
    const comment = req.params.commentId
    const status = req.body.likeStatus
    // console.log(status, "likestatus")
    // console.log(await CommentModel.findOne({_id: new ObjectId(comment)}))

    let addLikes = await commentService.addReaction(comment, user._id.toString(), status)

    // console.log(await CommentModel.findOne({_id: new ObjectId(comment)}))
    if (addLikes) {
        res.sendStatus(204)
    } else res.sendStatus(404)


})

//1) добавить лайк в сервисе 2)добавить сохранение в БД  обновленной БД модели 3) получение по статусу

commentsRouter.delete('/:id', authMiddleware, isCommentOwnerMiddleware, async (req: Request, res: Response) => {
    const commentId = req.params.id
    let isDeleted = await commentService.deleteComment(commentId)
    if (isDeleted) {
        res.sendStatus(204)
    } else res.sendStatus(404)
})