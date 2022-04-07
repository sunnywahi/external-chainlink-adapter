# Chainlink NodeJS External Adapter

This adapter is in NodeJS. Comments are included to assist with development and testing of the external adapter. Once the API-specific values (like query parameters and API key authentication) have been added to the adapter, it is very easy to add some tests to verify that the data will be correctly formatted when returned to the Chainlink node. There is no need to use any additional frameworks or to run a Chainlink node in order to test the adapter.


## This adapter has ability to connect to hedera using their SDK, This is just proving the point that we can go using chainlink from one chain and get data from other decentralized network i.e. hedera in this case
- `acount balance` - can do account balance operation
- `token info` - can fetch token info
- `mint` -can mint token for a given tokenId

## zip the file

`7z a external-chainlink-adapter.zip "*.*" -r`
or
`zip -r external-chainlink-adapter.zip`

## Input Params

- `type`: type can be account or token
- `accountId`: accountId to check in hedera
- `mint`: if you want to mint token

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

- In Functions, create a new function, In case Zip option isn't working? Then you have to paste all the .js files
- Function to execute: gcpservice
- Click More, Add variable (repeat for all environment variables)
  - NAME: HEDERA_ACCOUNT_ID
  - VALUE: 


### Once the adapter is deployed, you need to add the adapter URL to the ChainLink Node via bridge, keep note of the bridge name you created

### Using bridge we can define our job, here in this case bridge name is hedera-data

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

### Important params that you need to provide in your api consumer contract

- `linkToken`: link token address deployed on a chain
- `oracle`: address of chainlink oracle that has our chainlink node added to it.
- `jobId`: job that has the external adapter bridge added that we can call and get data from

### Node EOA(externally Owned address) on Kovan, that we have deployed 0x1eDC8c2105AC01313033e91A3d4307f2cdE09E54

