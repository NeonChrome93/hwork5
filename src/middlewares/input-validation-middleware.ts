import {Request, Response, NextFunction} from "express";
import {ErrorFormatter, validationResult} from "express-validator";
import {errorType} from "../models/error-models";

export const inputValidationMiddleware =  (req: Request, res: Response, next: NextFunction) => {

    const errFormat: ErrorFormatter<unknown> = (type: any) :errorType => {
        return {
            message: type.msg,
            field: type.path
        }
    }

    const errors = validationResult(req).formatWith(errFormat);
    if (!errors.isEmpty()) {
        return res.status(400).send({errorsMessages: errors.array()});
    } else next()


}
