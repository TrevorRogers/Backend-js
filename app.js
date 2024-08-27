const express = require("express");
const {healthCheck, getTopics, getApi} = require("./controller/controller");
const app = express()
const fs = require('fs/promises')

app.get("/api/healthCheck", healthCheck);
app.get("/api/topics", getTopics);
app.get("/api", getApi)

app.use(express.json())

app.use((err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({msg: "Invalid request"})
    } else {
        next(err)
    }
})

app.use((err, req, res, next)=> {
    if (err.message === "Not found") {
        res.status(404).send(err)
    } else {
        next(err)
    }
})


module.exports = app