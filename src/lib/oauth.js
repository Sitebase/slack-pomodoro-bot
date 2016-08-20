require('isomorphic-fetch');
const qs = require('querystring');
const dynamo = require('lib/dynamo');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

const startAuth = function(resp) {
    const query = qs.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        scope: 'identity.basic'
    });
    resp.writeHead(302, {
        Location: `https://slack.com/oauth/authorize?${query}`
    });
    resp.end();
}

const exchangeCode = function(code) {
    const query = qs.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code
    });

    const req = new Request(`https://slack.com/api/oauth.access?${query}`);
    return fetch(req)
        .then(resp => resp.json())
}

const saveToken = function(owner_id, token) {

    return new Promise(resolve => {
        dynamo.put({
            TableName: process.env.AUTH_TABLE,
            Item: Object.assign({
                owner: owner_id
            }, token)
        }, function(err, data) {
            console.log('asws', err, data);
        });
    });
}

module.exports = {
    exchangeCode,
    saveToken,
    startAuth
};
