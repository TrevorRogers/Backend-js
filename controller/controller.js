const articles = require("../db/data/test-data/articles");
const { selectTopics, selectApi, selectArticles, selectArticlesById, selectCommentsByArticleId} = require("../models/model");



const getTopics = (request, response) => {
    selectTopics().then((topics) => {
        response.status(200).send({topics});
    })
  };

  const getApi = (request, response, next) => {
    selectApi().then((endpoint) => {
        response.status(200).send({endpoint});
    }).catch((err)=>{
        next(err)
    })
  };

  const getArticles = (request, response, next) => {
    selectArticles().then((articles)=> {
        response.status(200).send({articles})
    }).catch((err)=>{
        next(err)
    })
  }

  getArticlesById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticlesById(article_id).then((article) => {
      res.status(200).send({ article });
    }).catch(next);
  };

  getComments = (req, res, next) => {
    const { article_id } = req.params;
    if (!article_id) {
        return res.status(400).send({msg: "Invalid request"})
    }
    selectCommentsByArticleId(article_id).then((comments) => {
        res.status(200).send({comments})
    }).catch(next)
  }



  module.exports =  {getTopics, getApi, getArticles, getArticlesById, getComments} 