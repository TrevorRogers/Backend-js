const { promises } = require("supertest/lib/test");
const db = require("../db/connection");
const fs = require("fs/promises");
const articles = require("../db/data/test-data/articles");


const selectTopics = () => {
    return db.query("SELECT * FROM topics")
    .then(({rows}) => {
        if (rows.length === 0) return Promise.reject({msg: "Not found"})
        return rows;
    })
};

const selectApi = () => {
    return fs.readFile(`${__dirname}/../endpoints.json`, 'utf-8').then((data)=> {
        const endpoints = JSON.parse(data);
        return endpoints
        })    
    }

const selectArticles = () => {
    return db.query(
        `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url,
        COUNT(comments.comment_id) AS comment_count FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY created_at DESC;`)
    .then(({rows})=> {
     if (rows.length === 0) return Promise.reject({msg: "Not found"})
            return rows;
    })
}

// const selectArticles = () => {
//     return db.query("SELECT * FROM articles ORDER BY created_at DESC")
//     .then(({rows})=> {
//      if (rows.length === 0) return Promise.reject({msg: "Not found"})
//             return rows;
//     })
// }

selectArticlesById = (article_id) => {
    return db
      .query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
      .then((result) => {
        if (result.rows.length === 0) return Promise.reject({msg: "Not found"});
        return result.rows[0];
      });
  };
 

module.exports =  { selectTopics, selectApi, selectArticles, selectArticlesById} 