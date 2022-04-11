# Chainlink NodeJS External Adapter

This adapter is in NodeJS. Comments are included to assist with development and testing of the external adapter. Once the API-specific values (like query parameters and API key authentication) have been added to the adapter, it is very easy to add some tests to verify that the data will be correctly formatted when returned to the Chainlink node. There is no need to use any additional frameworks or to run a Chainlink node in order to test the adapter.

## Project files you should be interested in
- `fetch-data.js`: exposes function processRequest and createRequest, processRequest has the code to connect to hedera sdk client and createRequest is the function that can make call to external URL and get data from it. Each function take customParams that is the request body params you can provide to the function call
- `index.js`: have function gcpservice, that can be used as serverless function on gcp side to get data from hedera.
- `.env`: contains the env properties that are needed to run the project. Please note in case of serverless function like GCP it has to be added as Add Variable while setting up GCP function

## In processRequest function: We connect to hedera using their SDK, This is just proving the point that we can go using chainlink from one chain and get data from other decentralized network i.e. hedera in this case
- we can do account balance operation
- we  can fetch token info
- we can mint token for a given tokenId

## Input Params for processRequest, specified via processRequestCustomParam

- `type`: type can be account or token
- `accountId`: accountId to check in hedera
- `mint`: seto true, if you want to mint token and for this you need to specify type as token

```json
{
    "id": 2,
    "data": {
        "type": "account",
        "accountId": "0.0.30802823"
    }
}
```

## Output

```json
{
  "jobRunID": 2,
  "data": {
    "raw": {
      "hbars": "1000.00000004 ℏ",
      "tokens": [
        {
          "tokenId": "0.0.30812445",
          "balance": "0",
          "decimals": 0
        },
        {
          "tokenId": "0.0.30813577",
          "balance": "1",
          "decimals": 0
        },
        {
          "tokenId": "0.0.30813578",
          "balance": "0",
          "decimals": 0
        },
        {
          "tokenId": "0.0.30818225",
          "balance": "1",
          "decimals": 0
        }
      ]
    },
    "result": "100000000004"
  },
  "statusCode": 200
}
```

## zip the file

`7z a external-chainlink-adapter.zip "*.*" -r`
or
`zip -r external-chainlink-adapter.zip`


## Install Locally

Install dependencies:

```bash
npm install
```

Natively run the application (defaults to port 8080):

### Run

```bash
npm run run-local
```

## Call the external adapter/API server

- using CURL or you can use POSTMAN

```bash
curl -X POST -H "content-type:application/json" "http://localhost:8080/" --data '{"id": 2,"data": {"type": "account", "accountId": "0.0.30802822" }}'
```

## Docker

If you wish to use Docker to run the adapter, you can build the image by running the following command:

```bash
docker build . -t external-chainlink-adapter
```

Then run it with:

```bash
docker run -p 8080:8080 -it external-chainlink-adapter:latest
```

## Serverless hosts


### Install to GCP
- Login to GCP, create a new cloud function
- Make sure you select the HTTP function and say allow unauthenticated
- In Functions, create a new function, In case Zip option isn't working? Then you have to paste all the .js files from the project and choose the function for node.js
- Function to execute: gcpservice, the one which is exported in index.js
- Click More, Add variable (repeat for all environment variables)
  - NAME: HEDERA_ACCOUNT_ID
  - VALUE: REPLACE


### Next steps for adding the function to your chain-link node
- Once you have started the function, you will get the URL for the function and you should copy it.
- Make sure your chain-link node is started and you can access it via http://localhost:6688
- Login into that and then select the bridge and add new bridge, while giving it the name you want like we named it `hedera-data` and give it the URL that we copied after gcp function deployment.
- Also keep note of the node address(EOA) of your chainlink node.

### Next steps deploy your own oracle
- Go to https://docs.chain.link/docs/fulfilling-requests/ and then follow section`Deploy your own Oracle Contract`
- The follow section `Add your node to the oracle contract`
- Then follow section `Add a job the node section`, Using bridge we can define our job, here in this case bridge name is hedera-data, here note to update the contractAddress of Oracle which is 0xd8A207C172131DeDCD6B1cA83d16C5EAb3439A8b to your oracle address in 2 places
```
type = "directrequest"
schemaVersion = 1
name = "Check-Hedera-Account"
contractAddress = "0xd8A207C172131DeDCD6B1cA83d16C5EAb3439A8b"
maxTaskDuration = "0s"
observationSource = """
    decode_log   [type=ethabidecodelog
                  abi="OracleRequest(bytes32 indexed specId, address requester, bytes32 requestId, uint256 payment, address callbackAddr, bytes4 callbackFunctionId, uint256 cancelExpiration, uint256 dataVersion, bytes data)"
                  data="$(jobRun.logData)"
                  topics="$(jobRun.logTopics)"]

    decode_cbor  [type=cborparse data="$(decode_log.data)"]
    fetch        [type=bridge name="hedera-data" requestData="{\\"id\\": $(jobSpec.externalJobID), \\"data\\": { \\"type\\": $(decode_cbor.type), \\"accountId\\": $(decode_cbor.accountId), \\"mint\\": $(decode_cbor.mint)}}"]
    parse        [type=jsonparse path="$(decode_cbor.path)" data="$(fetch)"]
    encode_data  [type=ethabiencode abi="(uint256 value)" data="{ \\"value\\": $(parse) }"]
    encode_tx    [type=ethabiencode
                  abi="fulfillOracleRequest(bytes32 requestId, uint256 payment, address callbackAddress, bytes4 callbackFunctionId, uint256 expiration, bytes32 data)"
                  data="{\\"requestId\\": $(decode_log.requestId), \\"payment\\": $(decode_log.payment), \\"callbackAddress\\": $(decode_log.callbackAddr), \\"callbackFunctionId\\": $(decode_log.callbackFunctionId), \\"expiration\\": $(decode_log.cancelExpiration), \\"data\\": $(encode_data)}"
                 ]
    submit_tx    [type=ethtx to="0xd8A207C172131DeDCD6B1cA83d16C5EAb3439A8b" data="$(encode_tx)"]

    decode_log -> decode_cbor -> fetch -> parse -> encode_data -> encode_tx -> submit_tx
"""
```

### Then you can do the `Create a request to your node` from https://docs.chain.link/docs/fulfilling-requests/ , or you can use the external-chainlink-adapter-api project for the same

- `linkToken`: link token address deployed on a chain
- `oracle`: address of chainlink oracle that has our chainlink node added to it.
- `jobId`: job that has the external adapter bridge added that we can call and get data from, make sure you remove any `-` in the jobId.


### There is also one more way you can test your serverless function via webhook job
- Please note here you directly give the bridge name and supply the fix parameters and when you have made this job, it will give you RUN button on top and you can just click on it.
```
type = "webhook"
schemaVersion = 1
name = "HEDERA-DATA-EA-Web"
observationSource = """
fetch        [type=bridge name="hedera-data" requestData="{\\"id\\": \\"0\\", \\"data\\": { \\"type\\": \\"account\\", \\"accountId\\": \\"0.0.30802822\\", \\"mint\\": \\"\\"}}"]

    fetch
"""
```
