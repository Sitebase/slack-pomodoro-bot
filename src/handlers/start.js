const _ = require('lodash');
const Slack = require('lib/slack');
const store = require('lib/dynamo');
const connect = require('handlers/connect').call;

const db = store('pomodoros', {
    primaryKey: 'user'
});
const tokens = store('tokens', {
    primaryKey: 'owner'
});

module.exports.call = function(team, user) {
    return tokens.get([ team.id, user.id ])
        .then(token => {
            token = _.get(token, 'access_token');

            if (!token)
                return connect();

            const api = Slack(token);
            const value = { busy: true, name: user.name };

            return api.startPomodoro()
                .then(() => db.set([ team.id, user.id ], value))
                .then(() => ({
                    text: 'I have started a new pomodoro for you'
                }));
        });
}

module.exports.command = function(command, data) {
    const team = { id: data.team_id };
    const user = { id: data.user_id, name: data.user_name };

    return module.exports.call(team, user);
}

module.exports.action = function(data) {
    return module.exports.call(data.team, data.user);
}
