import {NextFunction, Request, Response} from "express";

export let authGuardMiddleware = ( req: Request, res : Response, next: NextFunction) => {
    // res.send(shops)
    console.log('header', req.headers)
    const encode = Buffer.from("admin:qwerty", "utf-8").toString("base64")
    console.log(encode)
    if(req.headers.authorization === `Basic ${encode}`) {
        next();
    }
    else res.sendStatus(401)
}
