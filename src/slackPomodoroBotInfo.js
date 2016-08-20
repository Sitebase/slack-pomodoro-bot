const info = require('./package.json');

exports.handler = function(event, context, callback) {
    callback(null, {
        name: info.name,
        version: info.version,
        description: info.description
    });
};
