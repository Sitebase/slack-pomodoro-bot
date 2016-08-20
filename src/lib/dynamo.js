const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.AWS_REGION || 'eu-central-1' });
const dynamo = new AWS.DynamoDB.DocumentClient();

module.exports = dynamo;
