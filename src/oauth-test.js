const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const server = express();

const commands = require('controllers/commands');
const oauth = require('controllers/oauth');

server.use(bodyParser.urlencoded({ extended: true }));

server.get('/commands', commands.GET);
server.post('/commands', commands.POST);

server.get('/oauth/authorize', oauth.AUTHORIZE);
server.get('/oauth/access', oauth.ACCESS);

server.listen(process.env.PORT || 3000);
