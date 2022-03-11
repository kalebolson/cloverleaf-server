const AmazonDaxClient = require('amazon-dax-client');
let AWS = require('aws-sdk')
const region = process.env.REGION
AWS.config.update({ region: region, accessKeyId: process.env.AWSKEY })
let ddbClient = new AWS.DynamoDB.DocumentClient()

async function saveUser (creds) {
    const tableName = "CL-Users"
    const params = {
        TableName: tableName,
        Item: {
            "RecordID": creds.RecordID,
            "PasswordHash": creds.PasswordHash,
            "Email": creds.Email
        }
    }

    return await ddbClient.put(params).promise()
}

async function getUser (creds) {
    const tableName = "CL-Users"
    const params = {
        TableName: tableName,
        Key: {
            "Email": creds.Email
        }
    }

    let allItems = await (await ddbClient.scan(params).promise()).Items
    let result = allItems.filter((item) => {
        return item.Email == creds.Email
    })[0]

    return result
}

async function getUserByID (creds) {
    const tableName = "CL-Users"
    const params = {
        TableName: tableName,
        Key: {
            "RecordID": creds.RecordID
        }
    }
    
    return await (await ddbClient.get(params).promise()).Item
}

async function updateUserPassword (creds) {
    const tableName = "CL-Users"
    const params = {
        TableName: tableName,
        Key: {
            "RecordID": creds.RecordID
        },
        UpdateExpression: "set PasswordHash = :p",
        ExpressionAttributeValues: {
            ":p": creds.PasswordHash
        },
        ReturnValues: "UPDATED_NEW"
    }

    return await ddbClient.update(params).promise()
}

module.exports = { saveUser, getUser, getUserByID, updateUserPassword }