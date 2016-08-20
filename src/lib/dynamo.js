const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.AWS_REGION || 'eu-central-1' });
const dynamo = new AWS.DynamoDB.DocumentClient();
const _ = require('lodash');

const call = (obj, method) => (...args) => {
    return new Promise((resolve, reject) =>  {
        obj[method](...args, (err, data) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(data);
        });
    });
};

/**
 * Store client
 *
 * @param table The table to use for this store instance
 */
const Store = function(table, options) {
    if (this.constructor !== Store)
        return new Store(table, options);

    options = options || {};

    this.table = 'pomodoro.' + table;
    this.db = options.db || dynamo;
    this.primaryKey = options.primaryKey;

    if (!this.primaryKey) {
        console.trace('You broke it, please supply primaryKey');
    }
}

/**
 * List records
 *
 * @param key string For records with composed keys, filter by parts
 *
 */
Store.prototype.list = function(key) {
    const params = {
        TableName: this.table,
        KeyConditions: {
            [this.primaryKey]: {
                ComparisionOperator: 'BEGINS_WITH',
                AttributeValueList: [ key ]
            }
        }
    };

    return call(this.db, 'query')(params)
        .then(data => data.Items);
}


/**
 * Find a record by key
 *
 * @param key mixed The primary key for the record
 *
 */
Store.prototype.get = function(key) {
    key = _.isArray(key) ? key.join('.') : key;

    const params = {
        TableName: this.table,
        Key: {
            [this.primaryKey]: key
        }
    };

    return call(this.db, 'get')(params)
        .then(data => data.Item);
}

/**
 * Set a record by key
 *
 * @param key mixed The primary key for the record
 *
 */
Store.prototype.set = function(key, value) {
    key = _.isArray(key) ? key.join('::') : key;

    const params = {
        TableName: this.table,
        Item: Object.assign({
            [this.primaryKey]: key
        }, value)
    };

    return call(this.db, 'put')(params);
}

/**
 * Set a record by key
 *
 * @param key mixed The primary key for the record
 *
 */
Store.prototype.delete = function(key) {
    key = _.isArray(key) ? key.join('::') : key;

    const params = {
        TableName: this.table,
        Key: {
            [this.primaryKey]: key
        }
    }

    return call(this.db, 'delete')(params);
}

module.exports = Store;
