import {body} from "express-validator";
import {inputValidationMiddleware} from "./input-validation-middleware";

export const validationLoginAuth = [
    body('loginOrEmail').notEmpty().withMessage('incorrect login or email'),
    body('loginOrEmail').isString().trim().isLength({min: 3, max: 150}).withMessage('incorrect login or email'),
    body('password').notEmpty().withMessage('password is required'),
    body('password').isString().trim().isLength({min: 6, max: 10}).withMessage('incorrect password'),

    inputValidationMiddleware
]