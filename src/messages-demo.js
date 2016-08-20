const Message = require('lib/message');

const BOT_NAME = process.env.BOT_NAME || '@pomodorobot';

const slackToken = process.env.token || 'gIkuvaNzQIHg97ATvDxqgjtO';
const processOptions = { token: slackToken };

const data1 = Message.process({
    token: 'gIkuvaNzQIHg97ATvDxqgjtO',
    team_id: 'T0001',
    api_app_id: 'A0FFV41KK',
    event: {
        type: "message",
        channel: "C2147483705",
        user: "U2147483697",
        text: "Hello world",
        ts: "1355517523.000005"
    },
    event_ts: '',
    type: 'message.channels',
    authed_users: [
        "U061F7AUR"
    ]
}, processOptions);

const data2 = Message.process({
    token: 'gIkuvaNzQIHg97ATvDxqgjtO',
    team_id: 'T0001',
    api_app_id: 'A0FFV41KK',
    event: {
        type: "message",
        channel: "C2147483705",
        user: "U2147483697",
        text: "Hello @wim and @gert",
        ts: "1355517523.000005"
    },
    event_ts: '',
    type: 'message.channels',
    authed_users: [
        "U061F7AUR"
    ]
}, processOptions);

const data3 = Message.process({
    token: 'gIkuvaNzQIHg97ATvDxqgjtO',
    team_id: 'T0001',
    api_app_id: 'A0FFV41KK',
    event: {
        type: "message",
        channel: "C2147483705",
        user: "U2147483697",
        text: "Hello @pomodorobot",
        ts: "1355517523.000005"
    },
    event_ts: '',
    type: 'message.channels',
    authed_users: [
        "U061F7AUR"
    ]
}, processOptions);

const name = function(data) {
    if (data.words.indexOf(BOT_NAME) > -1) {
        console.log('The bot was mentioned');
        return true;
    }
}

const mention = function(data) {
    const names = [];

    data.words.forEach(function(w) {
        if (/^@/.test(w))
            names.push(w);
    });

    if (names.length > 0) {
        console.log(names.join(', '), names.length > 1 ? 'where' : 'is', 'mentioned');
        return true;
    }
}

const handler = Message(mention)
    .message(name);

handler.exec(data1).catch(console.error.bind(console));
handler.exec(data2).catch(console.error.bind(console));
handler.exec(data3).catch(console.error.bind(console));

require('http').createServer().listen(3000);
