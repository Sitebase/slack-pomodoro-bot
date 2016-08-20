/**
 * Start a new command handler chain.
 *
 * @param command string The command to match
 * @param cb function The method that will be called on a match.
 */
const Command = function(command, cb) {
    if (this.constructor !== Command)
        return new Command(command, cb);

    this._action = cb;
    this._command = command.replace(/^\//, '')
        .replace(/^\s+|\s+$/, '')
        .toLowerCase();
}

/**
 * Add a new command handler to the chain.
 *
 * @param command string The command to match
 * @param cb function The method that will be called on a match.
 *
 */
Command.prototype.command = function(command, cb) {
    const next = new Command(command, cb);
    next._next = this;
    return next;
}

/**
 * Run the last matching command handler that has been added.
 *
 * @param data object An object containing the POST data that slack sends.
 * @param command string Optionally overwrite the value in data.command.
 */
Command.prototype.exec = function(data, command) {
    command = (command || data.command || '').toLowerCase();
    if (command == this._command) {
        if (Command.debug)
            console.log(data.command + ' ' + data.text);

        return Promise.resolve(this._action(command, data));
    }

    if (!this._next)
        return Promise.reject();

    return this._next.exec(data, command);
}

/**
 * Validate that the request actually came from Slack.
 *
 * @param data object The POST data from Slack.
 * @param options object The token that was issued can be passed through here.
 */
Command.validate = function(data, options) {
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
Command.process = function(data, options) {
    Command.validate(data, options);

    return Object.assign({}, data, {
        words: (data.text || '').split(' ')
    });
}

Command.debug = false;

module.exports = Command;
