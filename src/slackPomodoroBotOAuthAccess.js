const oauth = require('./lib/oauth');

exports.handler = function(event, context, callback) {
    const code = event.params.querystring.code;

    if (!code) {
        callback(new Error('Failed to complete request'));
        return;
    }

    oauth.exchangeCode(code)
        .then(function(token) {
            const user_id = token.user && token.user.id || token.user_id;
            const team_id = token.team && token.team.id || token.team_id;
            const owner = user_id ? [team_id, user_id] : team_id;
            return oauth.saveToken(owner, token);
        })
        .then((data) => {
            callback(null, '<script>window.close();</script>');
        })
        .catch(err => {
            callback(new Error('We were unable to store your access at this time.'));
            return;
        });
};
