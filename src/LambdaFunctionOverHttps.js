console.log('Loading function');

var AWS = require('aws-sdk');
var info = require('./package.json');
var dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context, callback) {
    callback(null, {
        name: info.name,
        version: info.version,
        description: info.description
    });
};
