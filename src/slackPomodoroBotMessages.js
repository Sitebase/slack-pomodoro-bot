var info = require('./package.json');

exports.handler = function(event, context, callback) {
    callback(null, {
        description: 'This is the messages endpoint'
    });
};
