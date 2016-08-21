const Command = require('lib/command');
const env = require('env.json');

const start = require('handlers/start').command;
const stop = require('handlers/stop').command;
const status = require('handlers/status').command;

const processOptions = { token: env.SLACK_VERIFICATION_TOKEN || 'gIkuvaNzQIHg97ATvDxqgjtO' };
const commandHandler = Command('start', start)
    .command('stop', stop)
    .command('status', status);

exports.handler = function(event, context, callback) {
    Promise.resolve()
        .then(() => Command.process(event, processOptions))
        .then(data => {
            const command = data.words.length ? data.words[0] : 'status';
            return commandHandler.exec(data, command);
        })
        .then(result => {
            callback(null, result);
        }).catch(err => {
            console.error('ERROR:', err);
            callback(new Error('Something went wrong :confused:'));
        });
};
