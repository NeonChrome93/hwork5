import {Request, Response,Router} from "express";
import {blogRepository} from "../repositories/blogs-repository";
import {postsRepository} from "../repositories/posts-repository";

export const testingRouters = Router({});



testingRouters.delete('/all-data', (req: Request, res: Response) => {
    blogRepository.deleteAllBlogs();
    postsRepository.deleteAllPosts()
    res.sendStatus(204)
})