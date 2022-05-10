const {Requester, Validator} = require('@chainlink/external-adapter');
const {
    AccountId,
    TokenInfoQuery,
    TokenId,
    AccountInfoQuery,
    AccountBalanceQuery,
    HbarUnit,
    TokenMintTransaction, PrivateKey
} = require('@hashgraph/sdk');

// Define custom error scenarios for the API.
// Return true for the adapter to retry.
const customError = (data) => {
    if (data.Response === 'Error') return true
    return false
}

// Define custom parameters to be used by the adapter.
// Extra parameters can be stated in the extra object,
// with a Boolean value indicating whether or not they
// should be required.
const processRequestCustomParams = {
    account: ['type'],
    value: ['value', 'accountId', 'tokenId'],
    mint: false,
    endpoint: false
}

const createRequestCustomParams = {
    // An array of strings can be used to indicate that one of
    // the following keys must be supplied by the requester
    base: ['base', 'from', 'coin'],
    quote: ['quote', 'to', 'market'],
    // Specific keys can be given a Boolean flag to indicate
    // whether or not the requester is required to provide
    // a value
    endpoint: false,
}

// function that can take the data and do the native processing
const processRequest = async (hederaClient, input, callback) => {
    const validator = new Validator(input, processRequestCustomParams);
    const jobRunID = validator.validated.id;
    const type = validator.validated.data.account;
    const value = validator.validated.data.value;
    let responseData;
    let responseResult;
    if (type === 'account') {
        console.log(`checking account info for account Id ${value}`);
        responseData = await getAccountBalance(hederaClient, AccountId.fromString(value));
        responseResult = responseData.hbars.to(HbarUnit.Tinybar);
    } else {
        if (!validator.validated.data.mint) {
            console.log(`checking token info for token Id ${value}`);
            responseData = await getTokenInfo(hederaClient, TokenId.fromString(value));
            responseResult = responseData.totalSupply.low;
        } else {
            let minToken = await mintToken(hederaClient, value);
            responseData = {
                tokenId: value,
                serialNumber: minToken
            }
            responseResult = responseData.serialNumber;
        }
    }
    let response = {
        jobRunID,
        data: {
            raw: responseData,
            result: responseResult
        },
        statusCode: 200
    }
    callback(200, response);
}

const balanceCheck = async(input, callback) => {
    const jobRunID = input.id;
    let responseResult = between(1, 100);

    let response = {
        jobRunID,
        data: {
            raw: {
                name : "randomBalanceNumber",
                balance: responseResult
            },
            result: responseResult
        },
        statusCode: 200
    }
    callback(200, response);
}

//Function that can take the data and do outside REST CALL
const createRequest = (input, callback) => {
    // The Validator helps you validate the Chainlink request data
    const validator = new Validator(callback, input, createRequestCustomParams)
    const jobRunID = validator.validated.id
    const endpoint = validator.validated.data.endpoint || 'price'
    const url = `https://min-api.cryptocompare.com/data/${endpoint}`
    const fsym = validator.validated.data.base.toUpperCase()
    const tsyms = validator.validated.data.quote.toUpperCase()

    const params = {
        fsym,
        tsyms
    }

    // This is where you would add method and headers
    // you can add method like GET or POST and add it to the config
    // The default is GET requests
    // method = 'get'
    // headers = 'headers.....'
    const config = {
        url,
        params
    }

    // The Requester allows API calls be retry in case of timeout
    // or connection failure
    Requester.request(config, customError)
        .then(response => {
            // It's common practice to store the desired value at the top-level
            // result key. This allows different adapters to be compatible with
            // one another.
            response.data.result = Requester.validateResultNumber(response.data, [tsyms])
            callback(response.status, Requester.success(jobRunID, response))
        })
        .catch(error => {
            callback(500, Requester.errored(jobRunID, error))
        })
}

async function getAccountBalance(hederaClient, accountId) {
    let accountBalance = await new AccountBalanceQuery()
        .setAccountId(accountId)
        .execute(hederaClient);
    console.log(`accountBalance for ${accountId} is ${accountBalance.hbars}`)
    return accountBalance
}

async function getAccountInfo(hederaClient, accountId) {
    let accountInfo = await new AccountInfoQuery()
        .setAccountId(accountId)
        .execute(hederaClient);
    console.log(`accountBalance for ${accountId} is ${accountInfo.balance}`)
    return accountInfo
}

async function getTokenInfo(hederaClient, tokenId) {
    let tokenInfo = await new TokenInfoQuery()
        .setTokenId(tokenId)
        .execute(hederaClient)
    return tokenInfo
}

/**
 * MINT TAKES THE SUPPLY KEY, IF NO SUPPLY KEY GIVEN WHILE CREATING TOKEN THEN CANT MINT
 */
async function mintToken(hederaClient, token) {
    console.log('ready to mint some tokens');
    let tokenId = TokenId.fromString(token);
    let tokenMintTransaction = await new TokenMintTransaction()
        .setTokenId(tokenId)
        .addMetadata(Buffer.from("Excellent people"))
        .freezeWith(hederaClient);

    const signedTransaction = await tokenMintTransaction.sign(PrivateKey.fromString(process.env.SUPPLY_KEY));
    let transactionResponse = await signedTransaction.execute(hederaClient);
    let mintTxReceipt = await transactionResponse.getReceipt(hederaClient);
    console.log(`- Created NFT ${tokenId} with serial: ${mintTxReceipt.serials[0].low} \n`);
    return mintTxReceipt.serials[0].low;
}

function between(min, max) {
    return Math.floor(
        Math.random() * (max - min) + min
    )
}


// This allows the function to be exported for testing
// or for running in express
module.exports = {
    createRequest,
    processRequest,
    balanceCheck
}
