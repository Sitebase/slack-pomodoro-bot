const Command = require('lib/command');

const start = require('commands/start');
const stop = require('commands/stop');
const status = require('commands/status');

const processOptions = { token: process.env.SLACK_VERIFICATION_TOKEN || 'gIkuvaNzQIHg97ATvDxqgjtO' };
const commandHandler = Command('start', start)
    .command('stop', stop)
    .command('status', status);

module.exports = {};

module.exports.GET = function slackSslCheck(req, resp) {
    resp.end();
}

module.exports.POST = function receiveCommand(req, resp) {
    const data = Command.process(req.body, processOptions);

    commandHandler.exec(data, data.words[0]).then(result => {
        resp.json(result);
    }).catch(err => {
        console.error('ERROR:', err);
        resp.end('Somthing went wrong :confused:');
    });
}
