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


const selectArticles = (sort_by, topic) => {
    let queryStr = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url,
        COUNT(comments.comment_id) AS comment_count FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id`
    const queryVals = [];
    const validTopics = [
        "mitch",
        "cats"
    ]
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
            return Promise.reject({msg: "Invalid request"});
        } else {
            queryStr += ` ORDER BY ${sort_by} DESC`;
        }
    } 
    if (!sort_by && !topic) {
        queryStr += ` ORDER BY created_at DESC`
    }
    if (topic) {
       if (validTopics.includes(topic)) {
        queryStr = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url,
        COUNT(comments.comment_id) AS comment_count FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        LEFT JOIN topics ON articles.topic = topics.slug
        WHERE topics.slug = $1
        GROUP BY articles.article_id`, [topic];
        queryVals.push(topic);
    } else {
        return Promise.reject({msg: "Invalid request"});
        }
    }
    
        

    return db.query(queryStr, queryVals).then(({rows})=> {
     if (rows.length === 0) return Promise.reject({msg: "Not found"})
            return rows;
    })
}

selectArticlesById = (article_id) => {
    return db
      .query(`SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, articles.body,
        COUNT(comments.comment_id) AS comment_count FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id`, [article_id])
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
    
    const updateArticlesById = (article_id, inc_votes) => {
        const queryStr = `UPDATE articles
            SET votes = votes + $2
            WHERE articles.article_id = $1
            RETURNING *;`
            const queryVals = [article_id, inc_votes]
    
        return db.query(queryStr, queryVals).then(({rows}) => {
            if (rows.length === 0) return Promise.reject({msg: "Not found"})
                return rows[0];
        })
    }
 

module.exports =  { selectTopics, selectApi, selectArticles, selectArticlesById, selectCommentsByArticleId, insertComment, removeCommentById, selectUsers, updateArticlesById} 