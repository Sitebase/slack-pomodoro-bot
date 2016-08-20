const Slack = require('lib/slack');
const store = require('lib/store');
const connect = require('commands/connect');

module.exports = function(command, data) {
    const team = data.team_id;
    const user = data.user_id;

    return store('tokens').get(user)
        .then(token => {
            if (!token)
                return connect('connect', data);

            const api = Slack(token);

            return api.startPomodoro()
                .then(() => store('pomodoros').set([ team, user ], true))
                .then(() => ({
                    text: 'I have started a new pomodoro for you'
                }));
        });
}
