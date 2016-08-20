const qs = require('querystring');
const info = require('./package.json');

exports.handler = function(event, context, callback) {

    const CLIENT_ID = event.stage.CLIENT_ID || 'not-found';
    const CLIENT_SECRET = event.stage.CLIENT_SECRET || 'not-found';

    const query = qs.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        scope: event.params.querystring.scope || 'identity.basic',
        team: event.params.querystring.team || 'no-team'
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
