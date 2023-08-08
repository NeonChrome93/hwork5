import {Request, Response, Router} from "express";
import {userServiсe} from "../domain/users-servise";
import {UserCreateModel} from "../models/users-models/user.models";
import {getQueryPagination, getQueryUserPagination} from "../middlewares/pagination";
import {blogsServise} from "../domain/blogs-servise";
import {validationCreateUser} from "../middlewares/user-create-validation";
import {authGuardMiddleware} from "../middlewares/auth";


export const usersRouters = Router({})

usersRouters.get('/',
    authGuardMiddleware,
    async (req: Request, res: Response) => {
        const pagination = getQueryUserPagination(req.query)
        const arr = await userServiсe.getUsers(pagination);
        res.status(200).send(arr);


    }),

    usersRouters.post('/',
        authGuardMiddleware,
        ...validationCreateUser,
        async (req: Request, res: Response) => {
            const userCreateModel: UserCreateModel = {
                login: req.body.login,
                email: req.body.email,
                password: req.body.password
            }
            const newUser = await userServiсe.createUser(userCreateModel)

            res.status(201).send(newUser)
        })

usersRouters.delete('/:id',
    authGuardMiddleware,
    async (req: Request, res: Response) => {
    const userId = req.params.id
        const isDeleted = await userServiсe.deleteUser(userId)
        if(isDeleted) {
            res.sendStatus(204)
        }
        else res.sendStatus(404)


    })