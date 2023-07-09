import {body} from "express-validator";
import {inputValidationMiddleware} from "./input-validation-middleware";
import {dbLocal} from "../db/db-local";
import {blogCollection} from "../db/database";

export const validationCreateUpdatePost = [
    body('title').notEmpty().withMessage('title is required'),
    body('title').isString().trim().isLength({min: 1, max: 30}).withMessage('title not empty and length min 1 max 15'),
    body('shortDescription').notEmpty().withMessage('shortDescription is required'),
    body('shortDescription').isString().trim().isLength({
        min: 1,
        max: 100
    }).withMessage('shortDescription not empty and length min 1 max 500'),
    body('content').trim().notEmpty().withMessage('content is required'),
    body('content').isString().trim().isLength({max: 1000}).withMessage('content max length 100'),
    body('blogId').notEmpty().withMessage('blogId is required'),
    body('blogId').isString().trim().withMessage('blogId should be string'),
    body('blogId').custom(async (value) => {
        let findId = await blogCollection.findOne({id: value})
       // console.log(value, findId, dbLocal.blogs)
        if (!findId) {
            throw new Error('blog not found');
        }
        else return true
     }),
    inputValidationMiddleware
]