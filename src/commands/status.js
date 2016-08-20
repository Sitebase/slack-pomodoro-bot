const store = require('lib/dynamo');
const db = store('pomodoros', {
    primaryKey: 'user'
});

module.exports = function(command, data) {
    const team = data.team_id;
    const user = data.user_id;

    return db.list(team)
        .then(all => ({
            text: 'Here is the status of your colleagues: ' + JSON.stringify(all)
        }));
}
