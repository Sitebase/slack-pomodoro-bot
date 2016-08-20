module.exports = {};

module.exports.promisify = function promisify(f, ctx) {
    return (...args) => new Promise((resolve, reject) => {
        f.call(ctx, ...args, (err, result) => err ? reject(err) : resolve(result));
    });
};
