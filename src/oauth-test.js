const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const server = express();
const oauth = require('lib/oauth');

const Command = require('lib/command');
const start = require('commands/start');
const stop = require('commands/stop');
const status = require('commands/status');
const slackToken = process.env.token || 'gIkuvaNzQIHg97ATvDxqgjtO';
const processOptions = { token: slackToken };

server.use(bodyParser.urlencoded({ extended: true }));

server.get('/commands', function(req, resp) {
    resp.end('OK');
});

server.post('/commands', function(req, resp) {
    const data = Command.process(req.body, processOptions);

    const handler = Command('start', () => Promise.resolve({
        text: "It's 80 degrees right now.",
        attachments: [
            {
                text: "Partly cloudy today and tomorrow"
            }
        ]
    }));

    handler.exec(data, data.words[0]).then(result => {
        resp.json(result);
    });
});

server.get('/oauth/authorize', function(req, resp) {
    oauth.startAuth(resp, {
        team: req.query.team
    });
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
