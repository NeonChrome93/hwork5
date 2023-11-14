import request from "supertest";
import {app} from "../src/app";
import {runDatabase} from "../src/db/database";

const createBlog = {
    name: "Yaroslaw",
    description: "blabla",
    websiteUrl: "https://odintsovo.hh.ru/vacancy/81832912?from=vacancy_search_list"
}

const createPost = {
    title: "Cook",
    shortDescription: "Kitchen",
    content: "Reciepe",

}

const updatePost = {
    title: "Cook",
    shortDescription: "Kitchen",
    content: "DDDGTUIYJTUT",

}


const headers = {
    "Authorization": "Basic YWRtaW46cXdlcnR5"
}

describe('Post API', () => {
    jest.setTimeout(10000)

    beforeAll(async () => {
        await runDatabase()
    })

    it('before all', async () => {
        await request(app).delete('/testing/all-data').expect(204)

    })

    it('Get all posts 200', async () => {
        const blogs = await request(app).post('/blogs').set(headers).send(createPost)
        await request(app).get('/posts').expect(200, { pagesCount: 1, page: 1, pageSize: 10, totalCount: 0, items: [] })
    })
let blog: any;
 let post: any;
    it('Should create post with blogId', async () => {
        blog = await request(app).post('/blogs').set(headers).send(createBlog)
        console.log(blog.body, 'blogs')
        post = await request(app).post('/posts').set(headers).send({ ...createPost, blogId: blog.body.id} )



        await request(app).get(`/posts/${post.body.id}`).expect(200, post.body)

        //update post
       // await request(app).put(`/posts/${posts.body.id}`).set(headers).send({...updatePost, blogId: blogs.body.id}).expect(204)
    })

    it('Put post', async () => {
        //update post
        await request(app).put(`/posts/${post.body.id}`).set(headers).send({...updatePost, blogId: blog.body.id}).expect(204)
    })

    it('Put blog', async () => {
        const blogs = await request(app).post('/blogs').set(headers).send(createBlog).expect(201)
        // await request(app).put(`/blogs/${blogs.body.id}`).set(headers).send(updateBlog).expect(204)
    })

    it('Delete blog ID', async () => {
        const blogs = await request(app).post('/blogs').set(headers).send(createBlog).expect(201)
        //await request(app).delete(`/blogs/${blogs.body.id}`).set(headers).send(updateBlog).expect(204)
    })

//add negative tests //add auth tests
})

// describe('Post API', () => {
//
//     it('Put post', async () => {
//         const blogs = await request(app).post('/blogs').set(headers).send(createBlog).expect(201)
//         // await request(app).put(`/blogs/${blogs.body.id}`).set(headers).send(updateBlog).expect(204)
//     })
//
// })