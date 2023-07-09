import request from "supertest";
import {app} from "../src/app";
import {body} from "express-validator";
// describe('base', () => {
//
//     it('base', () => {
//        expect(1).toBe(1);
//
//     })
//
// })

const createBlog = {
    name: "Yaroslaw",
    description: "blabla",
    websiteUrl: "https://odintsovo.hh.ru/vacancy/81832912?from=vacancy_search_list"
}

const updateBlog = {
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

    it('Get all blogs 200', async () => {
        await request(app)
            .get('/blogs').expect(200, [])
    })

    it('Get blog ID', async () => {
        const blogs = await request(app).post('/blogs').set(headers).send(createBlog)
        await request(app).get(`/blogs/${blogs.body.id}`).expect(200, blogs.body)
    })

    it('Create and Put blog', async () => {
        const blogs = await request(app).post('/blogs').set(headers).send(createBlog).expect(201)
        await request(app).put(`/blogs/${blogs.body.id}`).set(headers).send(updateBlog).expect(204)
    })

    it('Delete blog ID', async () => {
        const blogs = await request(app).post('/blogs').set(headers).send(createBlog).expect(201)
        await request(app).delete(`/blogs/${blogs.body.id}`).set(headers).send(updateBlog).expect(204)
    })

    it('Put blog without aut', async () => {
        const blogs = await request(app).post('/blogs').send(createBlog).expect(401)
        //await request(app).put(`/blogs/${blogs.body.id}`).set(headers).send(updateBlog).expect(401)
    })


})