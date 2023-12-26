import request from "supertest";
import {app} from "../src/app";
import {runDatabase} from "../src/db/database";

const headers = {
    "Authorization": "Basic YWRtaW46cXdlcnR5",
    'set-cookie': [ 'refreshToken=j%3A%7B%7D; Path=/; HttpOnly; Secure' ],
    'Cookie': [ 'refreshToken=j%3A%7B%7D; Path=/; HttpOnly; Secure' ]
}


describe('Auth token', () => {
    jest.setTimeout(10000)

    beforeAll(async () => {
        await runDatabase()
    })

    it('create user', async () => {
        const user = await request(app).post('/users').set(headers).send({
            login: "settler",
            email: "sdfzedfESF@gmail.com",
            password: "1237777"
        })

        for (let i = 0; i <= 4; i++) {
            const x = await request(app).post('/auth/login').auth('', {type:'bearer' }).set('Cookie', `token= asdasdasdasd`).
            send({loginOrEmail: "settler", password: "12377779"}).expect(401)
            //console.log(i,x.status)
        }
        await request(app).post('/auth/login').
        send({loginOrEmail: "settler", password: "1237777"}).expect(429)
        setTimeout(async () => { const x = await request(app).post('/auth/login').
        send({loginOrEmail: "settler", password: "123777789"}).expect(401)

        }, 10000)

        //const x = await request(app).post('/auth/login').
         //send({loginOrEmail: "settler", password: "1237777"}).

        //console.log(x.body)



        // headers['Cookie']  = [x.headers['set-cookie']]
        //  const refresh = await request(app).post('/auth/refresh-token').set(headers)
        //  console.log(refresh.body, refresh.status)
        //
        // headers['Cookie']  = [refresh.headers['set-cookie']]
        // const logout = await request(app).post('/auth/logout').set(headers)
        // console.log(logout.body, logout.status)

//mock jest
    })
})