const Action = require('lib/action');
const env = require('env.json');

const start = require('handlers/start').action;
const stop = require('handlers/stop').action;

const processOptions = {
    token: env.SLACK_VERIFICATION_TOKEN || 'gIkuvaNzQIHg97ATvDxqgjtO',
    types: [ 'pomodoro.start', 'pomodoro.stop' ]
};

const filter = (type, handler) => (data) => {
    if (data.type != type)
        return;

    return handler(data);
}

const actionHandler = Action(filter('pomodoro.start', start))
    .action(filter('pomodoro.stop', stop));

exports.handler = function(event, context, callback) {
    const data = JSON.parse(event.payload);

    Promise.resolve()
        .then(() => Action.process(data, processOptions))
        .then(data => actionHandler.exec(data))
        .then(result => callback(null, result))
        .catch(err => callback(err));
};
