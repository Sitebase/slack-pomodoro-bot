const http = require('http');
const express = require('express');
const server = express();
const oauth = require('lib/oauth');

server.get('/oauth/authorize', function(req, resp) {
    oauth.startAuth(resp);
});

server.get('/oauth/access', function(req, resp) {
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
            resp.statusCode = 500;
            resp.end('An error occurred');
            return;
        })
});

server.listen(process.env.PORT || 3000);
