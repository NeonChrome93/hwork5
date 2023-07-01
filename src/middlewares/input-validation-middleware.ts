import {Request, Response, NextFunction} from "express";
import { validationResult} from "express-validator";
import {errorType} from "../models/error-models";

export const inputValidationMiddleware =  (req: Request, res: Response, next: NextFunction) => {

    const errFormat = (  {type,location,path,value, msg} ) :errorType => {
        return {
            message: msg,
            field: path
        }

        //ErrorFormatter<unknown>
    }

    const errors = validationResult(req).formatWith(errFormat);
    if (!errors.isEmpty()) {
        return res.status(400).send({errorsMessages: errors.array({ onlyFirstError: true })});
    } else next()


}
