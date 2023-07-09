import {NextFunction, Response, Request} from "express";
import {validationResult} from "express-validator";
import {errorType} from "../models/error-models";

const errFormat = ({msg, path}: any): errorType => {
    return {
        message: msg,
        field: path
    }
}

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {


    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const errorsMessages = errors.array({onlyFirstError: true}).map(e => errFormat(e))
        return res.status(400).json({errorsMessages});
    } else return next()


}
