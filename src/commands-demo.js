const Command = require('lib/command');
const start = require('handlers/start');
const stop = require('handlers/stop');
const status = require('handlers/status');

const slackToken = process.env.token || 'gIkuvaNzQIHg97ATvDxqgjtO';
const processOptions = { token: slackToken };

// 3 sample datasets
const data1 = Command.process({
    token: 'gIkuvaNzQIHg97ATvDxqgjtO',
    team_id: 'T0001',
    team_domain: 'bubobox',
    channel_id: 'C2147483705',
    channel_name: 'develop',
    user_id: 'U2147483697',
    user_name: 'Jorgen',
    command: '/pomo',
    text: 'start',
    response_url: 'https://hooks.slack.com/commands/1234/5678'
}, processOptions);

const data2 = Command.process({
    token: 'gIkuvaNzQIHg97ATvDxqgjtO',
    team_id: 'T0001',
    team_domain: 'bubobox',
    channel_id: 'C2147483705',
    channel_name: 'develop',
    user_id: 'U2147483697',
    user_name: 'Jorgen',
    command: '/pomo',
    text: 'status',
    response_url: 'https://hooks.slack.com/commands/1234/5678'
}, processOptions);

const data3 = Command.process({
    token: 'gIkuvaNzQIHg97ATvDxqgjtO',
    team_id: 'T0001',
    team_domain: 'bubobox',
    channel_id: 'C2147483705',
    channel_name: 'develop',
    user_id: 'U2147483697',
    user_name: 'Jorgen',
    command: '/pomo',
    text: 'stop',
    response_url: 'https://hooks.slack.com/commands/1234/5678'
}, processOptions);

const done = function(resp) {
    if (typeof resp !== 'object') return;

    if (resp.answer)
        console.log('Bot said ' + resp.answer);
};

Command.debug = true;

const handler = Command('start', start)
    .command('stop', stop)
    .command('status', status)

handler.exec(data1, data1.words[0]).then(done);
handler.exec(data2, data2.words[0]).then(done);
handler.exec(data3, data3.words[0]).then(done);
