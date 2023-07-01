import {body} from "express-validator";
import {inputValidationMiddleware} from "./input-validation-middleware";

export const validationCreateUpdateBlog = [
    body('name').notEmpty().withMessage('name is required'),
    body('name').isString().trim().isLength({min: 1, max: 15}).withMessage('name not empty and length min 1 max 15'),
    body('description').notEmpty().withMessage('description is required'),
    body('description').isString().trim().isLength({min: 1,max: 500}).withMessage('description not empty and length min 1 max 500'),
    body('websiteUrl').notEmpty().withMessage('websiteUrl is required'),
    body('websiteUrl').isURL().withMessage('websiteUrl must be URL'),
    body('websiteUrl').isString().trim().isLength({max: 100}).withMessage('websiteUrl max length 100'),
    inputValidationMiddleware
    ]