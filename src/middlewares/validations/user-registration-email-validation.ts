import {body} from "express-validator";
import {inputValidationMiddleware} from "./input-validation-middleware";
import {usersRepository} from "../../repositories/users/users-repository-database";
import {strict} from "assert";
import {userService} from "../../domain/users-servise";

export const userRegistrationEmailValidation = [
    body('login').notEmpty().withMessage('incorrect login'),//custom
    body('login').isString().trim().isLength({min: 3, max: 10}).withMessage('incorrect login'),
    body('login').custom( async (login: string) => {
        const user = await usersRepository.findByLoginOrEmail(login)
        if(!user) throw new Error("user not exist")
        if(user.login) throw new Error("user already exist")
        return true

    }),
    body('password').notEmpty().withMessage('password is required'),
    body('password').isString().trim().isLength({min: 6, max: 10}).withMessage('incorrect password'),
    body('email').notEmpty().withMessage('incorrect email'),//custom
    body('email').isURL().withMessage('incorrect email'),
    body('email').isString().trim().isLength({max: 150}).withMessage('incorrect email'),
    body('email').custom(async (email: string) => {
        const user = await usersRepository.readUserByEmail(email)
        if(!user) throw new Error("user not exist")
        if(user.isConfirmed) throw new Error("email already confirmed")
        return true

    }),

    inputValidationMiddleware
]