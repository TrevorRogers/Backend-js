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

selectArticlesById = (article_id) => {
    return db
      .query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
      .then((result) => {
        if (result.rows.length === 0) return Promise.reject({msg: "Not found"});
        return result.rows[0];
      });
  };

  selectCommentsByArticleId = (article_id) => {
    return db
      .query('SELECT * FROM comments WHERE comments.article_id = $1 ORDER BY created_at DESC;', [article_id])
      .then((result) => {
        if (result.rows.length === 0) return Promise.reject({msg: "Not found"});
        return result.rows;
      });
  };

  insertComment = ({ username, body }) => {
    console.log("in model")
    return db
        .query(`INSERT INTO comments(username, body) 
            VALUES ($1, $2) RETURNING *`,[username, body])
        .then((result) => {
            console.log(result.rows)
            return result.rows[0]
        }).catch((err)=> {
            console.log(err)
        })
  }

  removeCommentById = (comment_id) => {
    return db.query('DELETE FROM comments WHERE comment_id = $1;', [comment_id])
    .then((result)=> {
       if(result.rowCount === 0) return Promise.reject({msg: "Not found"})
        return result
    })
  };

  const selectUsers = () => {
    return db.query("SELECT * FROM users")
    .then(({rows}) => {
        if (rows.length === 0) return Promise.reject({msg: "Not found"})
        return rows;
    })
};
 

module.exports =  { selectTopics, selectApi, selectArticles, selectArticlesById, selectCommentsByArticleId, insertComment, removeCommentById, selectUsers} 