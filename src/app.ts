import express from "express";
import {blogsRouter} from "./routers/blogs-router";
import {postsRouter} from "./routers/posts-router";
import {testingRouters} from "./routers/testing-routers";
import {usersRouters} from "./routers/users-routers";
import {authRouter} from "./routers/auth-router";
import {commentsRouter} from "./routers/comments-router";
import cookieParser from "cookie-parser";
import {securityDevisesRouter} from "./routers/security-devises-router";

export const app = express();
const parserMiddle = express.json()




app.use(parserMiddle)
app.use(cookieParser())

app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouters)
app.use('/auth', authRouter)
app.use('/comments', commentsRouter)
app.use('/security', securityDevisesRouter)

app.use('/testing/all-data', testingRouters)