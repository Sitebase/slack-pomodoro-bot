require('isomorphic-fetch');
const qs = require('querystring');
const dynamo = require('lib/dynamo');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const exchangeCode = function(code) {
    const query = qs.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code
    });

    const req = new Request(`https://slack.com/api/oauth.access?${query}`);
    fetch(req)
        .then(resp => resp.json);
}

const saveToken = function(team, token) {
    return new Promise(resolve => {
        dynamo.put({
            TableName: process.env.AUTH_TABLE,
            Item: token
        }, resolve);
    });
}
