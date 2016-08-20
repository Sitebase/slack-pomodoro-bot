const Slack = require('lib/slack');
const store = require('lib/store');

module.exports = function(command, data) {
    const team = data.team_id;
    const user = data.user_id;

    return store('pomodoros').list([ team, user ]).then(record => {
        if (!record) {
            return {
                text: 'No pomodoro runnning'
            };
        }
        return store('tokens').get(user).then(token => {
            if (!token)
                return connect('connect', data);

            const api = Slack(token);

            return api.stopPomodoro()
                .then(() => store('pomodoros').delete([ team, user ]))
                .then(() => ({
                    text: 'I have stopped your pomodoro'
                }));
        });
    });
}
