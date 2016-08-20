const Slack = require('lib/slack');
const store = require('lib/dynamo');
const db = store('pomodoros', {
    primaryKey: 'user'
});
const tokens = store('tokens', {
    primaryKey: 'owner'
});

module.exports = function(command, data) {
    const team = data.team_id;
    const user = data.user_id;

    return db.list([ team, user ]).then(record => {
        if (!record) {
            return {
                text: 'No pomodoro runnning'
            };
        }
        return tokens.get(user).then(token => {
            if (!token)
                return connect('connect', data);

            const api = Slack(token);

            return api.stopPomodoro()
                .then(() => db.delete([ team, user ]))
                .then(() => ({
                    text: 'I have stopped your pomodoro'
                }));
        });
    });
}
