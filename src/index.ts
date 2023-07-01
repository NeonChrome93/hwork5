import express, {NextFunction, Request, Response, Router} from 'express'
import bodyParser from "body-parser";
import {postsRouter} from "./routers/posts-router";
import {blogsRouter} from "./routers/blogs-router";
import {testingRouters} from "./routers/testing-routers";

const app = express();
const port = process.env.PORT || 5000;

const parserMiddle = bodyParser({});







app.use(parserMiddle)

app.use("/posts", postsRouter)
app.use("/blogs", blogsRouter)
app.use("/", testingRouters)





//app.get('/products/:title', (req: Request, res : Response) => {
 //   let product = products.find(el => el.title === req.params.title)
 //   if(product) {
//        res.send(product)
//    }
//    else res.send(404)
//})





app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})