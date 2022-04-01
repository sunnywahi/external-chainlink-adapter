const {Client} = require("@hashgraph/sdk");
require('dotenv').config();
const { processRequest } = require('./fetch-data.js');

//Depicting a POST api call for retreiving data.
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
module.exports = appRoute;
