const articles = require("../db/data/test-data/articles");
const { selectTopics, selectApi, selectArticles, selectArticlesById, selectCommentsByArticleId, insertComment, removeCommentById, selectUsers} = require("../models/model");



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

  const getArticlesById = (req, res, next) => {
    const { article_id } = req.params;
    selectArticlesById(article_id).then((article) => {
      res.status(200).send({ article });
    }).catch(next);
  };

  const getComments = (req, res, next) => {
    const { article_id } = req.params;
    if (!article_id) {
        return res.status(400).send({msg: "Invalid request"})
    }
    selectCommentsByArticleId(article_id).then((comments) => {
        res.status(200).send({comments})
    }).catch(next)
  }

  const postComments = (req, res, next) => {
    const newComment = req.body;
    console.log(newComment, "<<<< new comment")
    insertComment(newComment).then((comment) => {
        console.log(comment, "<<<<<<<<<<")
        res.status(201).send({comment})
    })
  }

  const deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params;
    removeCommentById(comment_id).then((result) => {
            res.status(204).send();      
    }).catch(next)
  };

  const getUsers = (req, res, next) => {
    selectUsers().then((user)=> {
        res.status(200).send({user})
    })
  }




  module.exports =  {getTopics, getApi, getArticles, getArticlesById, getComments, postComments, deleteCommentById, getUsers} 