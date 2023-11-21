
import {body} from "express-validator";
import {inputValidationMiddleware} from "./input-validation-middleware";
import {REACTIONS_ENUM} from "../../models/comments-models/comments-models";

export const likesValidation = [
    body('likeStatus').custom((value)=> {
        const keys = Object.keys(REACTIONS_ENUM);
        if(!keys.includes(value)){
            console.log(keys, "REACTIONS_ENUM[value]")
            throw new Error("incorect value for likeStatus")
        }
        else return true
    }),


    inputValidationMiddleware
]