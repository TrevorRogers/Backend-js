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
    describe("/api/topics", () => {
        test("200: sends an array of topic objects, each of which should have the following properties: slug, description", () => {
            return request(app)
                .get("/api/topics")
                .expect(200)
                .then(({body})=> {
                    expect(body.topics.length === 3).toBe(true)
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
        describe("/api/articles", ()=> {
            test("200: serves an array of all articles", () => {
                return request(app)
                    .get("/api/articles")
                    .expect(200)
                    .then(({body}) => {
                      expect(body.articles.length >= 1).toBe(true)
                      body.articles.forEach((article) => {
                        expect(article).toMatchObject({
                            article_id: expect.any(Number), title: expect.any(String), topic: expect.any(String), author: expect.any(String),
                            body: expect.any(String), created_at: expect.any(String), votes: expect.any(Number), article_img_url: expect.any(String)
                    })
                })          
            })
        })
    })
     describe("/api/articles", ()=> {
            test("200: serves an array of all articles", () => {
                return request(app)
                    .get("/api/articles")
                    .expect(200)
                    .then(({body}) => {
                      expect(body.articles.length >= 1).toBe(true)
                      body.articles.forEach((article) => {
                        expect(article).toMatchObject({
                            article_id: expect.any(Number), title: expect.any(String), topic: expect.any(String), author: expect.any(String),
                            body: expect.any(String), created_at: expect.any(String), votes: expect.any(Number), article_img_url: expect.any(String)
                    })
                })          
            })
        })
    })
    describe("/api/articles/:articles_id", ()=> {
        test("200: sends a single article to the client based by ID", () => {
            return request(app)
                .get("/api/articles/1")
                .expect(200)
                .then(({body}) => {
                  expect(body.article.article_id).toBe(1);
                  expect(body.article.title).toBe('Living in the shadow of a great man');
                  expect(body.article.topic).toBe('mitch');
                  expect(body.article.author).toBe('butter_bridge');
                  expect(body.article.body).toBe('I find this existence challenging'); 
                  expect(body.article.created_at).toBe('2020-07-09T20:11:00.000Z');
                  expect(body.article.votes).toBe(100);   
                  expect(body.article.article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700');     
            })
        })
        test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
            return request(app)
              .get('/api/articles/999')
              .expect(404)
              .then((response) => {
                expect(response.body.msg).toBe('Not found');
              });
          });
          test('GET:400 sends an appropriate status and error message when given an invalid id', () => {
            return request(app)
              .get('/api/articles/not-a-team')
              .expect(400)
              .then((response) => {
                expect(response.body.msg).toBe('Invalid request');
              });
          });
    })
 })
