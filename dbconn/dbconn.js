const AmazonDaxClient = require('amazon-dax-client');
let AWS = require('aws-sdk')
const region = process.env.region

AWS.config.update({ region: region })
let ddbClient = new AWS.DynamoDB.DocumentClient()

function saveUser (creds) {

}

function updateUserPassword (creds) {

}

module.exports = { saveUser, updateUserPassword }