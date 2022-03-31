const { processRequest, createRequest } = require('../index.js')
const {Client} = require("@hashgraph/sdk");
require('dotenv').config();
const appRoute = (app, hederaClient) => {

  app.post('/', async (req, res) => {
    console.log('POST Data: ', req.body)
    try {
      await processRequest(hederaClient, req.body, (status, result) => {
        console.log('Result: ', result)
        res.status(status).json(result)
      });
    }catch (error) {
      console.log(`exception while processing the request ${error}`);
      res.status(500).send('failed while processing the request');
    }
  })

}


// This is a wrapper to allow the function to work with
// AWS Lambda
exports.handler = (event, context, callback) => {
  createRequest(event, (statusCode, data) => {
    callback(null, data)
  })
}

// This is a wrapper to allow the function to work with
// newer AWS Lambda implementations
exports.handlerv2 = (event, context, callback) => {
  createRequest(JSON.parse(event.body), (statusCode, data) => {
    callback(null, {
      statusCode: statusCode,
      body: JSON.stringify(data),
      isBase64Encoded: false
    })
  })
}

module.exports = appRoute;
