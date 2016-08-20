const oauth = require('lib/oauth');

exports.AUTHORIZE = function(req, resp) {
    oauth.startAuth(resp, {
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
            const owner = token.team_id || (token.team.id + '.' + token.user.id);
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
