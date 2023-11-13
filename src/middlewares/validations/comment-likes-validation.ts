
import {body} from "express-validator";
import {inputValidationMiddleware} from "./input-validation-middleware";
import {REACTIONS_ENUM} from "../../models/comments-models/comments-models";

export const commentLikesValidation = [
    body('likeStatus').custom((value)=> {
        console.log("start checkin")
        const keys = Object.keys(REACTIONS_ENUM);
        console.log(keys, "REACTIONS_ENUM[value]")
        console.log(keys.includes(value), "keys.includes(value)")
        if(!keys.includes(value)){
            console.log(keys, "REACTIONS_ENUM[value]")
            throw new Error("incorect value for likeStatus")
        }
        else return true
    }),

    inputValidationMiddleware
]