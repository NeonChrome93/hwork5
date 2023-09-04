import {body} from "express-validator";
import {inputValidationMiddleware} from "./input-validation-middleware"

export const contentValidation = [
    //body('content').notEmpty().withMessage("comment is empty"),
    body('content').isString().trim().isLength({min: 20, max: 300}).withMessage('comment not empty and length min 20 max 300'),

    inputValidationMiddleware
]
