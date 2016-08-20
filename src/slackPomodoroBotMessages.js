const Event = require('lib/event');
const env = require('env.json');

const url_verification = (data) => {
    if (data.type !== 'url_verification')
        return;

    return data;
}

const mention = (data) => {
    if (data.type !== 'message.channels')
        return;

    const names = [];
    const event = data.event;

    event.words.forEach(function(w) {
        if (/^@/.test(w))
            names.push(w.replace(/^@/, ''));
    });

    if (names.length < 1)
        return;

    return db.list(team)
        .then(all => {
            return _.filter(all, v => {
                return v.busy && names.indexOf(v.user_name) > -1
            });
        })
        .then(busy => {
            if (busy.length < 1) return;

            return {
                text: _.map(busy, v => '@' + v.user_name).join(', ') +
                    ' are currenty doing a pomodoro'
            };
        });
};

const processOptions = {
    token: env.SLACK_VERIFICATION_TOKEN || 'gIkuvaNzQIHg97ATvDxqgjtO',
    types: [ 'url_verification', 'message.channels' ]
};
const eventHandler = Event(url_verification)
    .event(mention);

exports.handler = function(event, context, callback) {
    const data = event['body-json'];
    Promise.resolve()
        .then(() => Event.process(data))
        .then(data => eventHandler.exec(data))
        .catch(err => callback(err));
};
