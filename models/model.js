const { promises } = require("supertest/lib/test");
const db = require("../db/connection");
const fs = require("fs/promises")


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
 

module.exports =  { selectTopics, selectApi } 