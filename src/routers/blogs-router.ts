import {Request, Response, Router} from "express";
import {blogService} from "../domain/blog-service";
import {authGuardMiddleware} from "../middlewares/auth";
import {validationCreateUpdateBlog} from "../middlewares/validations/blogs-validation";
import {Blog} from "../models/blogs-models/blogs-models";
import {getQueryPagination} from "../middlewares/pagination";
import {postRepository} from "../repositories/posts/posts-repository-database";
import {validationCreatePostWithoutBlogId} from "../middlewares/validations/post-withoutBlogId-validation";
import {postService} from "../domain/post-service";
import {blogQueryRepository} from "../repositories/blogs/blog-query-repository";
import {blogRepository} from "../repositories/blogs/blogs-repository-database";


export const blogsRouter = Router({})

class BlogController {

    async getBlogs(req: Request, res: Response) {
        const pagination = getQueryPagination(req.query)
        const arr = await blogQueryRepository.readBlogs(pagination);
        res.status(200).send(arr);
    }

    async getBlogById(req: Request, res: Response) {
        const blogId = req.params.id
        let foundId = await blogQueryRepository.readBlogsId(blogId);
        if (foundId) {
            res.status(200).send(foundId)
        } else res.sendStatus(404)
    }

    async createBlog(req: Request, res: Response) {
        const newPosts: Blog = await blogService.createBlog(req.body)
        res.status(201).send(newPosts)
    }

    async updateBlog(req: Request, res: Response) {
        const postId = req.params.id
        let postUpdate = await blogService.updateBlogs(postId, req.body)
        if (postUpdate) {
            res.sendStatus(204)
        } else res.sendStatus(404)

    }

    async deleteBlog (req: Request, res: Response) {
    const postId = req.params.id
    const isDeleted = await blogService.deleteBlogs(postId)
    if (isDeleted) {
        res.sendStatus(204);
    } else res.sendStatus(404)
}

    async getPostByBlogId(req: Request, res: Response) {
        const blogId = req.params.id
        const pagination = getQueryPagination(req.query)
        const blog = await blogRepository.readBlogsId(blogId)
        if (!blog) return res.sendStatus(404)
        const arr = await postRepository.readPostsByBlogId(blogId, pagination); //servis
        return res.status(200).send(arr)
    }

    async createPostByBlogId(req: Request, res: Response) {
        const blogId = req.params.id
        const post = await postService.createPost({...req.body, blogId})
        if (!post) return res.sendStatus(404)
        return res.status(201).send(post)
    }

}

const blogControllerInstance = new BlogController()

blogsRouter.get('/', blogControllerInstance.getBlogs)

blogsRouter.get('/:id', blogControllerInstance.getBlogById)

blogsRouter.post('/',authGuardMiddleware, ...validationCreateUpdateBlog, blogControllerInstance.createBlog)

blogsRouter.put('/:id', authGuardMiddleware, ...validationCreateUpdateBlog, blogControllerInstance.updateBlog)

blogsRouter.delete('/:id',  authGuardMiddleware, blogControllerInstance.deleteBlog)

blogsRouter.get('/:id/posts',blogControllerInstance.getPostByBlogId)

blogsRouter.post('/:id/posts', authGuardMiddleware, ...validationCreatePostWithoutBlogId, blogControllerInstance.createPostByBlogId)





// blogsRouter.get('/', async (req: Request, res: Response) => {
//     const pagination = getQueryPagination(req.query)
//     const arr = await blogService.readBlogs(pagination);
//     res.status(200).send(arr);
// })

//pagination get

// blogsRouter.get('/:id', async (req: Request, res: Response) => {
//     const blogId = req.params.id
//     let foundId = await blogService.readBlogsId(blogId);
//     if (foundId) {
//         res.status(200).send(foundId)
//     } else res.sendStatus(404)
// })

// blogsRouter.get('/:id/posts', async (req: Request, res: Response) => {
//     const blogId = req.params.id
//     const pagination = getQueryPagination(req.query)
//     const blog = await blogService.readBlogsId(blogId)
//     if (!blog) return res.sendStatus(404)
//     const arr = await postRepository.readPostsByBlogId(blogId, pagination); //servis
//     return res.status(200).send(arr)
//
// })

// blogsRouter.post('/:id/posts',
//     authGuardMiddleware,
//     ...validationCreatePostWithoutBlogId,
//     async (req: Request, res: Response) => {
//         const blogId = req.params.id
//         const post = await postService.createPost({...req.body, blogId})
//         //const post = await postsRepository.createPost({...req.body, blogId});
//         if (!post) return res.sendStatus(404)
//         return res.status(201).send(post)
//
//     })


// blogsRouter.post('/',
//     authGuardMiddleware,
//     ...validationCreateUpdateBlog,
//     async (req: Request, res: Response) => {
//         const newPosts: Blog = await blogService.createBlog(req.body)
//         res.status(201).send(newPosts)
//
//
//     })

// blogsRouter.put('/:id',
//     authGuardMiddleware,
//     ...validationCreateUpdateBlog,
//     async (req: Request, res: Response) => {
//         const postId = req.params.id
//         let postUpdate = await blogService.updateBlogs(postId, req.body)
//         if (postUpdate) {
//             res.sendStatus(204)
//         } else res.sendStatus(404)
//
//     })

// blogsRouter.delete('/:id',
//     authGuardMiddleware,
//     async (req: Request, res: Response) => {
//         const postId = req.params.id
//         const isDeleted = await blogService.deleteBlogs(postId)
//         if (isDeleted) {
//             res.sendStatus(204);
//         } else res.sendStatus(404)
//     })
//
// blogsRouter.delete('/', (req: Request, res: Response) => {
//     blogRepository.deleteAllBlogs()
//     res.sendStatus(204)
// })