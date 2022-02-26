const AmazonDaxClient = require('amazon-dax-client');
let AWS = require('aws-sdk')
const region = process.env.region

AWS.config.update({ region: region })
let ddbClient = new AWS.DynamoDB.DocumentClient()

async function saveUser (creds) {
    const tableName = "CL-Users"
    const params = {
        TableName: tableName,
        Item: {
            "username": creds.username,
            "passwordHash": creds.passwordHash,
            "email": creds.email
        }
    }

    return await ddbClient.put(params, (err, data) => {
        return err || "Credentials added successfully"
    })
}

function getUser (creds) {
    const tableName = "CL-Users"
    const params = {
        TableName: tableName,
        Keys: {
            "username": creds.username
        }
    }

    return await ddbClient.get(params, (err, data) => {
        return err || data
    })
}

function updateUserPassword (creds) {
    const tableName = "CL-Users"
    const params = {
        TableName: tableName,
        Item: {
            "username": creds.username,
            "passwordHash": creds.passwordHash,
            "email": creds.email
        }
    }

    return await ddbClient.put(params, (err, data) => {
        return err || "Credentials added successfully"
    })
}

module.exports = { saveUser, updateUserPassword }