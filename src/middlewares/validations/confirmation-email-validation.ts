import {body} from "express-validator";
import {inputValidationMiddleware} from "./input-validation-middleware";

export const confirmationEmailValidation = [
    body('email').notEmpty().withMessage('incorrect email'),
    body('email').isURL().withMessage('incorrect email'),
    body('email').isString().trim().isLength({max: 150}).withMessage('incorrect email'),

    inputValidationMiddleware
]