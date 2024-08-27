const express = require("express");
const {getTopics, getApi, getArticles, getArticlesById} = require("./controller/controller");
const app = express()
const fs = require('fs/promises')


app.get("/api/topics", getTopics);
app.get("/api", getApi)
app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id", getArticlesById)

// app.use(express.json())

app.use((err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({msg: "Invalid request"})
    } else {
        next(err)
    }
})

app.use((err, req, res, next)=> {
    if (err.msg === "Not found") {
        res.status(404).send(err)
    } else {
        next(err)
    }
})


module.exports = app