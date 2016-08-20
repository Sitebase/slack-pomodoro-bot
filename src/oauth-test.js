const http = require('http');
const express = require('express');
const server = express();
const oauth = require('lib/oauth');

server.get('/oauth/access', function(req, resp) {
    const code = req.query.code;

    if (!code) {
        req.statusCode = 500;
        req.end();
        return;
    }

    oauth.exchangeCode(code)
        .then(function(token) {
            return oauth.saveToken(token.team_id, token);
        })
        .then(() => {
            req.end('Done');
        });
});
