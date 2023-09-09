import {body} from "express-validator";
import {inputValidationMiddleware} from "./input-validation-middleware";
import {usersRepository} from "../../repositories/users/users-repository-database";

export const confirmationEmailValidation = [
    body('email').notEmpty().withMessage('incorrect email'),
    body('email').isEmail().withMessage('incorrect email'),
    body('email').isString().trim().isLength({max: 150}).withMessage('incorrect email'),
    body('email').custom(async (email: string)=> {
        const user = await usersRepository.readUserByEmail(email)
        if(!user) throw new Error("user not exist")
        if(user.isConfirmed) throw new Error("user already confirmed")
        return true

    }),

    inputValidationMiddleware
]