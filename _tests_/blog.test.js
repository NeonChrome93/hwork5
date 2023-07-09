"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../src/app");
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
};
const updateBlog = {
    name: "Blalla",
    description: "Blalal",
    websiteUrl: "https://odintsovo.hh.ru/vacancy/81832912?from=vacancy_search_list"
};
const headers = {
    "Authorization": "Basic YWRtaW46cXdlcnR5"
};
describe('Post API', () => {
    it('before all', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app).delete('/testing/all-data').expect(204);
    }));
    it('Get all blogs 200', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app)
            .get('/blogs').expect(200, []);
    }));
    it('Get blog ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const blogs = yield (0, supertest_1.default)(app_1.app).post('/blogs').set(headers).send(createBlog);
        yield (0, supertest_1.default)(app_1.app).get(`/blogs/${blogs.body.id}`).expect(200, blogs.body);
    }));
    it('Create and Put blog', () => __awaiter(void 0, void 0, void 0, function* () {
        const blogs = yield (0, supertest_1.default)(app_1.app).post('/blogs').set(headers).send(createBlog).expect(201);
        yield (0, supertest_1.default)(app_1.app).put(`/blogs/${blogs.body.id}`).set(headers).send(updateBlog).expect(204);
    }));
    it('Delete blog ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const blogs = yield (0, supertest_1.default)(app_1.app).post('/blogs').set(headers).send(createBlog).expect(201);
        yield (0, supertest_1.default)(app_1.app).delete(`/blogs/${blogs.body.id}`).set(headers).send(updateBlog).expect(204);
    }));
    it('Put blog without aut', () => __awaiter(void 0, void 0, void 0, function* () {
        const blogs = yield (0, supertest_1.default)(app_1.app).post('/blogs').send(createBlog).expect(401);
        //await request(app).put(`/blogs/${blogs.body.id}`).set(headers).send(updateBlog).expect(401)
    }));
});
