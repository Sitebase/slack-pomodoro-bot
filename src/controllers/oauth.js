const oauth = require('lib/oauth');

exports.AUTHORIZE = function(req, resp) {
    oauth.startAuth(resp, {
        scope: req.query.scope,
        team: req.query.team
    });
};

exports.ACCESS = function(req, resp) {
    const code = req.query.code;

    if (!code) {
        resp.statusCode = 500;
        resp.end();
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
            resp.end('<script>window.close();</script>');
        })
        .catch(err => {
            console.error('ERROR:', err);
            resp.statusCode = 500;
            resp.end('An error occurred');
            return;
        })
};
