const articles = require("../db/data/test-data/articles");
const { selectTopics, selectApi, selectArticles, selectArticlesById} = require("../models/model");



const getTopics = (request, response) => {
    selectTopics().then((topics) => {
        response.status(200).send({topics});
    })
  };

  const getApi = (request, response) => {
    selectApi().then((endpoint) => {
        response.status(200).send({endpoint});
    }).catch((err)=>{
        next(err)
    })
  };

  const getArticles = (request, response) => {
    selectArticles().then((articles)=> {
        response.status(200).send({articles})
    }).catch((err)=>{
        console.log(err, "error in controller")
        next(err)
    })
  }

  getArticlesById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticlesById(article_id).then((article) => {
      res.status(200).send({ article });
    }).catch(next);
  };



  module.exports =  {getTopics, getApi, getArticles, getArticlesById} 