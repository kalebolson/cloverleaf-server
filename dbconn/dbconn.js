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
            "UserID": creds.UserID,
            "PasswordHash": creds.PasswordHash,
            "username": creds.username
        }
    }

    return await ddbClient.put(params).promise()
}

async function getUser (creds) {
    const tableName = "CL-Users"
    const params = {
        TableName: tableName,
        Key: {
            "UserID": creds.userID
        }
    }
    
    return await ddbClient.get(params).promise()
}

async function updateUserPassword (creds) {
    const tableName = "CL-Users"
    const params = {
        TableName: tableName,
        Key: {
            "UserID": creds.UserID
        },
        UpdateExpression: "set PasswordHash = :p",
        ExpressionAttributeValues: {
            ":p": creds.PasswordHash
        },
        ReturnValues: "UPDATED_NEW"
    }

    return await ddbClient.update(params).promise()
}

module.exports = { saveUser, getUser, updateUserPassword }