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
        "accountId": "0.0.30802822"
    }
}
```

## Output

```json
{
  "jobRunID": 4,
  "data": {
    "raw": {
      "tokenId": {
        "shard": {
          "low": 0,
          "high": 0,
          "unsigned": false
        },
        "realm": {
          "low": 0,
          "high": 0,
          "unsigned": false
        },
        "num": {
          "low": 30818225,
          "high": 0,
          "unsigned": false
        },
        "_checksum": null
      },
      "name": "\"GOAT\"",
      "symbol": "\"GOAT\"",
      "decimals": 0,
      "totalSupply": {
        "low": 13,
        "high": 0,
        "unsigned": true
      },
      "treasuryAccountId": {
        "shard": {
          "low": 0,
          "high": 0,
          "unsigned": false
        },
        "realm": {
          "low": 0,
          "high": 0,
          "unsigned": false
        },
        "num": {
          "low": 30802822,
          "high": 0,
          "unsigned": false
        },
        "aliasKey": null,
        "_checksum": null
      },
      "adminKey": {
        "_key": {
          "_key": {
            "_keyData": {
              "type": "Buffer",
              "data": [
                20,
                131,
                221,
                172,
                113,
                152,
                202,
                94,
                20,
                160,
                197,
                41,
                71,
                175,
                172,
                33,
                70,
                246,
                32,
                160,
                66,
                159,
                241,
                107,
                35,
                82,
                26,
                112,
                209,
                1,
                91,
                45
              ]
            }
          }
        }
      },
      "kycKey": null,
      "freezeKey": {
        "_key": {
          "_key": {
            "_keyData": {
              "type": "Buffer",
              "data": [
                82,
                218,
                232,
                148,
                30,
                252,
                3,
                102,
                47,
                37,
                75,
                32,
                146,
                191,
                164,
                126,
                99,
                241,
                220,
                160,
                92,
                127,
                153,
                10,
                41,
                176,
                47,
                15,
                128,
                148,
                85,
                8
              ]
            }
          }
        }
      },
      "pauseKey": {
        "_key": {
          "_key": {
            "_keyData": {
              "type": "Buffer",
              "data": [
                120,
                243,
                127,
                200,
                232,
                90,
                60,
                179,
                26,
                156,
                34,
                206,
                231,
                241,
                163,
                11,
                127,
                23,
                202,
                87,
                3,
                55,
                89,
                211,
                174,
                173,
                231,
                57,
                26,
                153,
                249,
                79
              ]
            }
          }
        }
      },
      "wipeKey": {
        "_key": {
          "_key": {
            "_keyData": {
              "type": "Buffer",
              "data": [
                234,
                93,
                123,
                102,
                75,
                212,
                166,
                202,
                151,
                243,
                88,
                107,
                11,
                75,
                43,
                22,
                143,
                228,
                235,
                112,
                253,
                180,
                16,
                97,
                253,
                74,
                16,
                150,
                209,
                183,
                80,
                63
              ]
            }
          }
        }
      },
      "supplyKey": {
        "_key": {
          "_key": {
            "_keyData": {
              "type": "Buffer",
              "data": [
                103,
                156,
                241,
                206,
                125,
                71,
                28,
                138,
                217,
                226,
                35,
                206,
                126,
                135,
                43,
                36,
                153,
                24,
                9,
                237,
                145,
                177,
                26,
                38,
                19,
                84,
                43,
                164,
                151,
                59,
                130,
                14
              ]
            }
          }
        }
      },
      "feeScheduleKey": null,
      "defaultFreezeStatus": false,
      "defaultKycStatus": null,
      "pauseStatus": false,
      "isDeleted": false,
      "autoRenewAccountId": {
        "shard": {
          "low": 0,
          "high": 0,
          "unsigned": false
        },
        "realm": {
          "low": 0,
          "high": 0,
          "unsigned": false
        },
        "num": {
          "low": 30778447,
          "high": 0,
          "unsigned": false
        },
        "aliasKey": null,
        "_checksum": null
      },
      "autoRenewPeriod": {
        "seconds": {
          "low": 7776000,
          "high": 0,
          "unsigned": false
        }
      },
      "expirationTime": {
        "seconds": {
          "low": 1653794587,
          "high": 0,
          "unsigned": false
        },
        "nanos": {
          "low": 0,
          "high": 0,
          "unsigned": false
        }
      },
      "tokenMemo": "",
      "customFees": [
        {
          "_feeCollectorAccountId": {
            "shard": {
              "low": 0,
              "high": 0,
              "unsigned": false
            },
            "realm": {
              "low": 0,
              "high": 0,
              "unsigned": false
            },
            "num": {
              "low": 30802822,
              "high": 0,
              "unsigned": false
            },
            "aliasKey": null,
            "_checksum": null
          },
          "_fallbackFee": {
            "_amount": {
              "low": 2000000000,
              "high": 0,
              "unsigned": false
            }
          },
          "_numerator": {
            "low": 5,
            "high": 0,
            "unsigned": false
          },
          "_denominator": {
            "low": 10,
            "high": 0,
            "unsigned": false
          }
        }
      ],
      "tokenType": {
        "_code": 1
      },
      "supplyType": {
        "_code": 1
      },
      "maxSupply": {
        "low": 100,
        "high": 0,
        "unsigned": false
      },
      "ledgerId": {
        "_ledgerId": {
          "type": "Buffer",
          "data": [
            1
          ]
        }
      }
    },
    "result": 13
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

### Node address on Kovan, that we have deployed 0x1eDC8c2105AC01313033e91A3d4307f2cdE09E54
