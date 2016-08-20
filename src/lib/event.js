/**
 * Create a new event handler chain.
 *
 * @param cb function The method that will be called on a match and should return truthy to end chain.
 *
 */
const Event = function(cb) {
    if (this.constructor !== Event)
        return new Event(cb);

    this._cb = cb;
}

/**
 * Add a new event handler to the chain.
 *
 * @param cb function The method that will be called on a match and should return truthy to end chain.
 *
 */
Event.prototype.event = function(cb) {
    const msg = new Event(cb);
    msg._next = this;
    return msg;
}

/**
 * Run the last matching event handler that has been added and returns truthy.
 *
 * @param data object An object containing the event data that slack sends.
 */
Event.prototype.exec = function(data) {
    return new Promise(resolve => {
        resolve(this._cb(data));
    })
    .then(result => {
        if (result) return result;

        if (!this._next)
            throw new Error('No handler found for event');

        return this._next.exec(data);
    });
}

/**
 * Validate that the request actually came from Slack.
 *
 * @param data object The POST data from Slack.
 * @param options object The token that was issued can be passed through here.
 */
Event.validate = function(data, options) {
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
Event.process = function(data, options) {
    Event.validate(data, options);

    options = options || {};

    const supportedTypes = options.types;

    if (!supportedTypes || supportedTypes.indexOf(data.type) < 0)
        throw new Error('Not handling this event of type ' + data.type);

    const event = data && data.event;

    if (event) {
        Object.assign(event, {
            words: (event.text || '').split(' ')
        });
    }

    return data;
}

module.exports = Event;
