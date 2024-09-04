const articles = require("../db/data/test-data/articles");
const { selectTopics, selectApi, selectArticles, selectArticlesById, selectCommentsByArticleId, insertComment, removeCommentById, selectUsers, updateArticlesById, selectUsersByUsername, insertArticle, insertTopic} = require("../models/model");



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
    const { sort_by, topic } = request.query
    selectArticles(sort_by, topic).then((articles)=> {
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
    const {username, body} = req.body;
    const { article_id } = req.params;
    insertComment(article_id, username, body).then((comment) => {
        res.status(201).send({comment})
    }).catch(next)
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

  const patchArticles = (req, res, next) => {
    const {article_id} = req.params;
    const {inc_votes} = req.body
    updateArticlesById(article_id, inc_votes).then((updatedArticle)=> {
        res.status(200).send({updatedArticle})
    })
  }

  const getUsersByUsername = (req, res, next) => {
    const { username } = req.params;
    selectUsersByUsername(username).then((user) => {
      res.status(200).send({ user });
    }).catch(next);
  };

  const postArticle = ( req, res, next) => {
    console.log("here")
    const {author, title, body, topic, article_img_url} = req.body;
    console.log(author, title, body, topic, article_img_url)
    insertArticle(author, title, body, topic, article_img_url).then((article) => {
        res.status(201).send({article})
    }).catch(next)
  }

  const postTopics = ( req, res, next) => {
    console.log("here")
    const {slug, description} = req.body;
    console.log(slug, description)
    insertTopic(slug, description).then((topic) => {
        res.status(201).send({topic})
    }).catch(next)
  }




  module.exports =  {getTopics, getApi, getArticles, getArticlesById, getComments, postComments, deleteCommentById, getUsers, patchArticles, getUsersByUsername, postArticle, postTopics} 