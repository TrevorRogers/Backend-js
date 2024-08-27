const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require ("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(()=> {
    return seed(testData)
})
afterAll(()=> {
    return db.end()
})

describe("nc news", () => {
    describe("/api/healthCheck", ()=> {
        test("200: responds with 200", ()=>{
            return request(app)
                .get("/api/healthCheck")
                .expect(200)
        })
    })
    describe("/api/topics", () => {
        test("200: sends an array of topic objects, each of which should have the following properties: slug, description", () => {
            return request(app)
                .get("/api/topics")
                .expect(200)
                .then(({body})=> {
                    expect(body.topics.length >= 1).toBe(true)
                    body.topics.forEach((topic) => {
                        expect(topic).toMatchObject({
                            description: expect.any(String), slug: expect.any(String)
                        })
                    })
                })
        })
    })
     describe("/api", ()=> {
        test("200: serves up a json representation of all the available endpoints of the api", () => {
            return request(app)
                .get("/api")
                .expect(200)
                .then(({body}) => {
                    expect(body.endpoint).toMatchObject({
                        "GET /api": expect.any(Object), "GET /api/topics": expect.any(Object), "GET /api/articles": expect.any(Object)
                    })
                      
                    })
                })
        })
     
    })
