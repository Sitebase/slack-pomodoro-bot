require('isomorphic-fetch');
const qs = require('querystring');
const store = require('lib/dynamo');
const db = store('tokens', {
    primaryKey: 'owner'
});

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

/**
 * Set required parameters and redirect to Slack auth endpoint.
 *
 * @param resp object The response object of express.js
 * @param options object You can pass the team to authenticate for here.
 *
 */
const startAuth = function(resp, options) {
    const query = qs.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        scope: 'identity.basic',
        team: options.team
    });
    resp.writeHead(302, {
        Location: `https://slack.com/oauth/authorize?${query}`
    });
    resp.end();
}

/**
 * Exchange the code received from Slack for a token.
 *
 * @param code string The code received from Slack
 */
const exchangeCode = function(code) {
    const query = qs.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code
    });

    const req = new Request(`https://slack.com/api/oauth.access?${query}`);
    return fetch(req)
        .then(resp => resp.json())
        .then(json => {
            if (!json.ok)
                throw new Error(json.error);

            return json;
        })
}

/**
 * Save a token for `owner_id` to the DynamoDB database.
 *
 * @param owner_id string The owner_id to store this token for
 * @param token Object The token object to store.
 */
const saveToken = function(owner_id, token) {
    return db.set(owner_id, token);
}

module.exports = {
    exchangeCode,
    saveToken,
    startAuth
};
