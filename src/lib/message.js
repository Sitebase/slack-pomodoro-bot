/**
 * Create a new message handler chain.
 *
 * @param cb function The method that will be called on a match and should return truthy to end chain.
 *
 */
const Message = function(cb) {
    if (this.constructor !== Message)
        return new Message(cb);

    this._cb = cb;
}

/**
 * Add a new message handler to the chain.
 *
 * @param cb function The method that will be called on a match and should return truthy to end chain.
 *
 */
Message.prototype.message = function(cb) {
    const msg = new Message(cb);
    msg._next = this;
    return msg;
}

/**
 * Run the last matching message handler that has been added and returns truthy.
 *
 * @param data object An object containing the event data that slack sends.
 */
Message.prototype.exec = function(data) {
    return new Promise(resolve => {
        resolve(this._cb(data));
    })
    .then(result => {
        if (result) return result;

        if (!this._next)
            throw new Error('No handler found for message');

        return this._next.exec(data);
    });
}

/**
 * Validate that the request actually came from Slack.
 *
 * @param data object The POST data from Slack.
 * @param options object The token that was issued can be passed through here.
 */
Message.validate = function(data, options) {
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
Message.process = function(data, options) {
    Message.validate(data, options);

    if (data.type !== 'message.channels')
        throw new Error('Not handling this message');

    const event = data && data.event;

    return Object.assign({}, event, {
        words: (event.text || '').split(' ')
    });
}

module.exports = Message;
