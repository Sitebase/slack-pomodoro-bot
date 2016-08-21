var info = require('./package.json');

exports.handler = function(event, context, callback) {
    console.log('gert');
    console.log(event);
    console.log(JSON.stringify(event));
    callback(null, event);
};
