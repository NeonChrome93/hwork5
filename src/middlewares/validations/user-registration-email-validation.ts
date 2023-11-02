import {body} from "express-validator";
import {inputValidationMiddleware} from "./input-validation-middleware";
import {usersRepository} from "../../repositories/users/users-repository-database";
import {strict} from "assert";
import {userService} from "../../domain/users-service";

export const userRegistrationEmailValidation = [
    body('login').isString().trim().isLength({
        min: 3,
        max: 10
    }).withMessage('incorrect login').custom(async (login: string) => {
        const user = await usersRepository.findByLoginOrEmail(login)
        if (!user) return true
        throw new Error("user with this login already exist")


    }),
    body('password').isString().trim().notEmpty().isLength({min: 6, max: 10}).withMessage('incorrect password'),

    body('email').isString().isEmail().custom(async (email: string) => {
        const user = await usersRepository.readUserByEmail(email)
        if (!user) return true
        throw new Error('user with this email already created')

    }),
    // body('email').notEmpty().withMessage('incorrect email'),//custom
    // body('email').isURL().withMessage('incorrect email'),
    // body('email').isString().trim().isLength({max: 150}).withMessage('incorrect email'),
    // body('email').custom(async (email: string) => {
    //     const user = await usersRepository.readUserByEmail(email)
    //     if(!user) return true
    //     if(user.isConfirmed) throw new Error("email already confirmed")
    //
    //
    // }),

    inputValidationMiddleware
]