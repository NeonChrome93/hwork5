import {body} from "express-validator";
import {inputValidationMiddleware} from "./input-validation-middleware";

export const userNewPasswordValidation = [
    body('newPassword').notEmpty().withMessage('newPassword is empty'),
    body('newPassword').isString().trim().isLength({min: 6, max:20}).withMessage('newPassword length min 6 max 20'),
    body('recoveryCode').isUUID(),

    inputValidationMiddleware
]