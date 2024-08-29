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

// const selectArticles = () => {
//     return db.query(
//         `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url,
//         COUNT(comments.comment_id) AS comment_count FROM articles
//         LEFT JOIN comments ON articles.article_id = comments.article_id
//         GROUP BY articles.article_id
//         ORDER BY created_at DESC;`)
//     .then(({rows})=> {
//      if (rows.length === 0) return Promise.reject({msg: "Not found"})
//             return rows;
//     })
// }

const selectArticles = (sort_by) => {
    console.log(sort_by)
    let queryStr = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url,
        COUNT(comments.comment_id) AS comment_count FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id`
    const queryVals = [];
    const validColumns = [
        "title",
        "topic",
        "author",
        "created_at",
        "votes",
        "comment_count"
    ];

    if (sort_by) {
        if (!validColumns.includes(sort_by)) {
            console.log("hereeee")
            return Promise.reject({msg: "Invalid request"});
        } else {
            queryStr += ` ORDER BY ${sort_by} DESC`;
        }
    } 
    if (!sort_by) {
        console.log("here")
        queryStr += ` ORDER BY created_at DESC`
        console.log(queryStr, "<<<< str")
    }

    return db.query(queryStr).then(({rows})=> {
        console.log(queryStr)
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

  insertComment = (article_id, username, body) => {
    return db
        .query(`INSERT INTO comments(article_id, author, body)
            VALUES ($1, $2, $3) RETURNING *`,[article_id, username, body])
        .then((result) => {
            if(result.rowCount === 0) return Promise.reject({msg: "Not found"})
            return result.rows[0]
        }).catch((err)=> {
            return Promise.reject({msg: "Invalid request"})
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