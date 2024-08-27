const { selectTopics, selectApi } = require("../models/model");

const healthCheck = (request, response) => {
    response.status(200).send("hello");
  };


const getTopics = (request, response) => {
    selectTopics().then((topics) => {
        response.status(200).send({topics});
    })
  };

  const getApi = (request, response) => {
    selectApi().then((endpoint) => {
        response.status(200).send({endpoint});
    })
  };

  module.exports =  {healthCheck, getTopics, getApi} 