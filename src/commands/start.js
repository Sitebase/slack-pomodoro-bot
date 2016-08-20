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

    return tokens.get(user)
        .then(token => {
            if (!token)
                return connect('connect', data);

            const api = Slack(token);

            return api.startPomodoro()
                .then(() => db.set([ team, user ], { busy: true }))
                .then(() => ({
                    text: 'I have started a new pomodoro for you'
                }));
        });
}
