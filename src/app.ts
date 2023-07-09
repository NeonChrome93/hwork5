import express from "express";
import {blogsRouter} from "./routers/blogs-router";
import {postsRouter} from "./routers/posts-router";
import {testingRouters} from "./routers/testing-routers";

export const app = express();
const parserMiddle = express.json()



app.use(parserMiddle)

app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/testing/all-data', testingRouters)