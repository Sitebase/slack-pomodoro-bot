const _ = require('lodash');
const Slack = require('lib/slack');
const store = require('lib/dynamo');
const db = store('pomodoros', {
    primaryKey: 'user'
});
const tokens = store('tokens', {
    primaryKey: 'owner'
});
const connect = require('handlers/connect');

module.exports.call = function(team, user) {
    return db.get([ team.id, user.id ]).then(record => {
        if (!record) {
            return {
                text: 'No pomodoro runnning'
            };
        }
        return tokens.get([ team.id, user.id ]).then(token => {
            token = _.get(token, 'access_token');

            if (!token)
                return connect();

            const api = Slack(token);

            return api.stopPomodoro()
                .then(() => db.delete([ team.id, user.id ]))
                .then(() => ({
                    text: 'I have stopped your pomodoro'
                }));
        });
    });
}

module.exports.command = (command, data) => {
    return module.exports.call({ id: data.team_id }, { id: data.user_id });
}

module.exports.action = (data) => {
    return module.exports.call(data.team, data.user);
}
