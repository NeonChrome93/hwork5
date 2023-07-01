import {Request, Response, NextFunction} from "express";
import {ErrorFormatter, validationResult} from "express-validator";
import {errorType} from "../models/error-models";

export const inputValidationMiddleware = function (req: Request, res: Response, next: NextFunction) {

    const errFormat: ErrorFormatter<unknown> = (type) => {
        return {
            message: type.msg,
            field: type.type
        }
    }

    const errors = validationResult(req).formatWith(errFormat);
    if (!errors.isEmpty()) {
        return res.status(400).json({errorsMessages: errors.array()});
    } else next()


}
