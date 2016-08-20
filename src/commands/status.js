const store = require('lib/store');

module.exports = function(command, data) {
    const team = data.team_id;
    const user = data.user_id;

    return store('pomodoros').list(team)
        .then(all => ({
            text: 'Here is the status of your colleagues: ' + JSON.stringify(all)
        }));
}
