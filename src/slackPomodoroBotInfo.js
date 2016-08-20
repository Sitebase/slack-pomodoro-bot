const qs = require('querystring');
const info = require('./package.json');

const CLIENT_ID = process.env.CLIENT_ID || 'not-found';
const CLIENT_SECRET = process.env.CLIENT_SECRET || 'not-found';

exports.handler = function(event, context, callback) {

    const query = qs.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        scope: event.scope || 'identity.basic',
        team: event.team || 'no-team'
    });

    callback(null, {
        name: info.name,
        version: info.version,
        description: info.description,
        authorize: `https://slack.com/oauth/authorize?${query}`,
        event: event,
        context: context
    });
};
