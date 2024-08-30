const express = require("express");
const {getTopics, getApi, getArticles, getArticlesById, getComments, postComments, deleteCommentById, getUsers, patchArticles} = require("./controller/controller");
const app = express()
const fs = require('fs/promises')
const apiRouter = require("express").Router();

apiRouter.get("/", (req, res) => {
    console.log("here")
    res.status(200).send("All ok from /api")
})

app.use(express.json())

app.get("/api/topics", getTopics);
app.get("/api", getApi)
app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id", getArticlesById)
app.get("/api/articles/:article_id/comments", getComments)
app.get("/api/users", getUsers)

app.post("/api/articles/:article_id/comments", postComments)

app.delete("/api/comments/:comment_id", deleteCommentById)

app.patch("/api/articles/:article_id", patchArticles)

app.use("/api", apiRouter)

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

app.use((err, req, res, next)=> {
    if (err.msg === "Invalid request") {
        res.status(400).send(err)
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    console.log(err, "errroororr")
})

app.use((err, req, res, next)=> {
    res.status(500).send({msg: err.msg})
})


module.exports = app