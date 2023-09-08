import {body} from "express-validator";
import {inputValidationMiddleware} from "./input-validation-middleware";
import {usersRepository} from "../../repositories/users/users-repository-database";

export const confirmationCodeValidator = [
    body('code').notEmpty().withMessage('incorrect code'),
    body('code').isString().trim().isLength({min: 1, max: 100}).withMessage('incorrect code'),
    body('code').custom(async (code: string) => {
       const user = await usersRepository.readUserByCode(code)
        if(!user) throw new Error("user not exist")
        if(user.isConfirmed) throw new Error("user already confirmed")
        return true
    }),


    inputValidationMiddleware
]