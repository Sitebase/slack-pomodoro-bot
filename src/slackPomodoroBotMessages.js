const Message = require('lib/message');
const env = require('env.json');

const mention = (data) => {
    const names = [];

    data.words.forEach(function(w) {
        if (/^@/.test(w))
            names.push(w);
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
                text: _.map(busy, v => '@' + v.user_name).join(', ') + ' are currenty doing a pomodoro';
            };
        });
};

const processOptions = { token: env.SLACK_VERIFICATION_TOKEN || 'gIkuvaNzQIHg97ATvDxqgjtO' };
const messageHandler = Message(mention);

exports.handler = function(event, context, callback) {
    Promise.resolve()
        .then(() => Message.process(event))
        .then(data => messagHandler.exec(data))
        .catch(err => callback(err));
};
