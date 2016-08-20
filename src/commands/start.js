const _ = require('lodash');
const Slack = require('lib/slack');
const store = require('lib/dynamo');
const connect = require('commands/connect');

const db = store('pomodoros', {
    primaryKey: 'user'
});
const tokens = store('tokens', {
    primaryKey: 'owner'
});

module.exports = function(command, data) {
    const team = data.team_id;
    const user = data.user_id;
    const user_name = data.user_name;

    return tokens.get([ team, user ])
        .then(token => {
            token = _.get(token, 'access_token');

            if (!token)
                return connect('connect', data);

            const api = Slack(token);
            return api.startPomodoro()
                .then(() => db.set([ team, user ], { busy: true, user_name }))
                .then(() => ({
                    text: 'I have started a new pomodoro for you'
                }));
        });
}
