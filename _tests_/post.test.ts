import request from "supertest";
import {app} from "../src/app";

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
    name: "Blalla",
    description: "Blalal",
    websiteUrl: "https://odintsovo.hh.ru/vacancy/81832912?from=vacancy_search_list"
}


const headers = {
    "Authorization": "Basic YWRtaW46cXdlcnR5"
}

describe('Post API', () => {

    it('before all', async () => {
        await request(app).delete('/testing/all-data').expect(204)

    })

    it('Get all posts 200', async () => {
        const blogs = await request(app).post('/blogs').set(headers).send(createPost)
        await request(app).get('/posts').expect(200, [])
    })

    it('Should create post with blogId', async () => {
        const blogs = await request(app).post('/blogs').set(headers).send(createBlog)
        console.log(blogs.body, 'blogs')
        const posts = await request(app).post('/posts').set(headers).send({ ...createPost, blogId: blogs.body.id} )



        await request(app).get(`/posts/${posts.body.id}`).expect(200, posts.body)
    })

    it('Put blog', async () => {
        const blogs = await request(app).post('/blogs').set(headers).send(createBlog).expect(201)
        // await request(app).put(`/blogs/${blogs.body.id}`).set(headers).send(updateBlog).expect(204)
    })

    it('Delete blog ID', async () => {
        const blogs = await request(app).post('/blogs').set(headers).send(createBlog).expect(201)
        //await request(app).delete(`/blogs/${blogs.body.id}`).set(headers).send(updateBlog).expect(204)
    })


})