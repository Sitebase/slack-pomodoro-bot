const _ = require('lodash');

/**
 * Create a new action handler chain.
 *
 * @param cb function The method that will be called on a match and should return truthy to end chain.
 *
 */
const Action = function(cb) {
    if (this.constructor !== Action)
        return new Action(cb);

    this._cb = cb;
}

/**
 * Add a new action handler to the chain.
 *
 * @param cb function The method that will be called on a match and should return truthy to end chain.
 *
 */
Action.prototype.action = function(cb) {
    const msg = new Action(cb);
    msg._next = this;
    return msg;
}

/**
 * Run the last matching action handler that has been added and returns truthy.
 *
 * @param data object An object containing the action data that slack sends.
 */
Action.prototype.exec = function(data) {
    return new Promise(resolve => {
        resolve(this._cb(data));
    })
    .then(result => {
        if (result) return result;

        if (!this._next)
            throw new Error('No handler found for action');

        return this._next.exec(data);
    });
}

/**
 * Validate that the request actually came from Slack.
 *
 * @param data object The POST data from Slack.
 * @param options object The token that was issued can be passed through here.
 */
Action.validate = function(data, options) {
    const token = options && options.token;

    if (data.token !== token)
        throw new Error('Invalid token supplied');
}

/**
 * Process the data received form Slack and enrich it.
 * This step will also validate that the request actually came from Slack.
 *
 * @param data object The POST data from Slack.
 * @param options object The token that was issued can be passed through here.
 */
Action.process = function(data, options) {
    Action.validate(data, options);

    options = options || {};

    const action = _.get(data, 'actions', [])[0] || {};
    data.action = action;
    data.type = action.name;

    const supportedTypes = options.types;

    if (!supportedTypes || supportedTypes.indexOf(data.type) < 0)
        throw new Error('Not handling this action of type ' + data.type);

    return data;
}

module.exports = Action;
