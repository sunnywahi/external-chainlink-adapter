console.clear();
const {Client, AccountId} = require('@hashgraph/sdk');
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const appRoute = require('./scripts/route.js');

//start the express
const app = express();
const port = process.env.EA_PORT || 8080;

//initialize body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//initialise the hedera test client
const hederaTestClient = Client.forTestnet();
hederaTestClient.setOperator(process.env.HEDERA_ACCOUNT_ID, process.env.HEDERA_PRIVATE_KEY);

//these details are passed to underlying routes so they can use this app and hederaTestClient objects
appRoute(app, hederaTestClient);

// finally, launch our server on port, specified
const server = app.listen(port, () => {
    console.log('listening on port %s...', server.address().port);
})

