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
    return db.query("SELECT * FROM articles")
    .then(({rows})=> {
     if (rows.length === 0) return Promise.reject({msg: "Not found"})
            return rows;
    })
}

selectArticlesById = (article_id) => {
    return db
      .query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
      .then((result) => {
        if (result.rows.length === 0) return Promise.reject({msg: "Not found"});
        return result.rows[0];
      });
  };
 

module.exports =  { selectTopics, selectApi, selectArticles, selectArticlesById} 