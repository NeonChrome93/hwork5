import express from "express";
import {blogsRouter} from "./routers/blogs-router";
import {postsRouter} from "./routers/posts-router";
import {testingRouters} from "./routers/testing-routers";
import {usersRouters} from "./routers/users-routers";
import {authRouter} from "./routers/auth-router";

export const app = express();
const parserMiddle = express.json()



app.use(parserMiddle)

app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouters)
app.use('/auth', authRouter)

app.use('/testing/all-data', testingRouters)