const WebClient = require('@slack/client').WebClient;
const promisify = require('util/promise').promisify;

const call = (f, ctx) => {
    return function () {
        const args = []; var args_i = arguments.length; while(args_i--) args[args_i] = arguments[args_i];
        const promise = promisify(f, ctx);

        return promise.apply(undefined, args)
        .then(res => {
            if (!res.ok)
                throw new Error(res.error || res);

            return res;
        });
    };
};

/**
 * Slack client
 *
 * @param token string API token for slack API
 */
const Slack = function(token) {
    if (this.constructor !== Slack)
        return new Slack(token);

    this.token = token;
    this.api = new WebClient(token);
}

/**
 * Start a pomodoro by setting DnD to 25 mins
 *
 * @param user string The user to start the pomodoro for
 *
 */
Slack.prototype.startPomodoro = function(user) {
    return call(this.api.dnd.setSnooze, this.api.dnd)(25);
}

/**
 * Sopt a pomodoro by ending DnD
 *
 * @param user string The user to stop the pomodoro for
 *
 */
Slack.prototype.stopPomodoro = function(user) {
    return call(this.api.dnd.endSnooze, this.api.dnd)();
}

module.exports = Slack;
