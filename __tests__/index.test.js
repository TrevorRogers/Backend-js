const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require ("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const toBeSortedBy = require("jest-sorted")

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
    describe("/api/articles", ()=> {
        test("200: serves an array of all articles sorted by date in desc order", () => {
            return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({body}) => {
                  expect(body.articles.length >= 1).toBe(true)
                  expect(body.articles).toBeSortedBy("created_at", { descending: true})
                  body.articles.forEach((article) => {
                    expect(article).toMatchObject({
                        article_id: expect.any(Number), 
                        title: expect.any(String), 
                        topic: expect.any(String), 
                        author: expect.any(String),
                        created_at: expect.any(String), 
                        votes: expect.any(Number), 
                        article_img_url: expect.any(String), 
                        comment_count: expect.any(String)
                    })
                })          
            })
        })
    })
    describe("/api/articles/:article_id/comments", ()=> {
        test("200: serves an array of comments for the given article_id sorted by date in desc order", () => {
            return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(({body}) => {
                  expect(body.comments.length).toBe(11)
                  expect(body.comments).toBeSortedBy("created_at", { descending: true})
                  body.comments.forEach((comment) => {
                    expect(comment.article_id).toBe(1)
                    expect(comment).toMatchObject({
                        body: expect.any(String), 
                        author: expect.any(String),
                        created_at: expect.any(String), 
                        votes: expect.any(Number), 
                        comment_id: expect.any(Number)
                    })
                })          
            })
        })
        test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
            return request(app)
              .get('/api/articles/999/comments')
              .expect(404)
              .then((response) => {
                expect(response.body.msg).toBe('Not found');
              });
          });
          test('GET:400 responds with an appropriate error message when given an invalid id', () => {
            return request(app)
              .get('/api/articles/not-an-id/comments')
              .expect(400)
              .then((response) => {
                expect(response.body.msg).toBe('Invalid request');
            });
        });
    //     test('POST:201 inserts a new team to the db and sends the new team back to the client', () => {
    //         const newComment = {
    //           username: 'MyUsername',
    //           body: "Insert body here"
    //         };
    //         return request(app)
    //           .post('/api/articles/1/comments')
    //           .send(newComment)
    //           .expect(201)
    //           .then(({body}) => {
    //             console.log(body)
    //             expect(body.comments.comment_id).toBe(12);
    //             expect(body.comments.username).toBe('MyUsername');
    //             expect(body.comments.body).toBe('Insert body here');
    //           });
    //       });
    //       test('POST:400 responds with an appropriate status and error message when provided with no username or body', () => {
    //         return request(app)
    //           .post('/api/articles/1/comments')
    //           .send({  })
    //           .expect(400)
    //           .then((response) => {
    //             expect(response.body.msg).toBe('Invalid request');
    //           });
    //       });
    })
    describe("/api/comments/:comment_id", () => {
        test('DELETE:204 deletes the given comment by comment_id', () => {
            return request(app).delete('/api/comments/1').expect(204);
          });
          test('DELETE:404 responds with an appropriate status and error message when given a non-existent id', () => {
            return request(app)
              .delete('/api/comments/999')
              .expect(404)
              .then((response) => {
                expect(response.body.msg).toBe('Not found');
              });
          });
          test('DELETE:400 responds with an appropriate status and error message when given an invalid id', () => {
            return request(app)
              .delete('/api/comments/not-a-comment')
              .expect(400)
              .then((response) => {
                expect(response.body.msg).toBe('Invalid request');
              });
          });
    })
    describe("/api/users", () => {
        test("200: sends an array of objects, each of which should have the following properties: username, name, avatar_url", () => {
            return request(app)
                .get("/api/users")
                .expect(200)
                .then(({body})=> {
                    console.log(body)
                    expect(body.user.length === 4).toBe(true)
                    body.user.forEach((users) => {
                        expect(users).toMatchObject({
                            username: expect.any(String), 
                            name: expect.any(String),
                            avatar_url: expect.any(String)
                        })
                    })
                })
        })
    })
})
