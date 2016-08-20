const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-central-1' });
const dynamo = new AWS.DynamoDB.DocumentClient();A

module.exports = dynamo;
