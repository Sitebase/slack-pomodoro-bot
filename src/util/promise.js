module.exports = {};

module.exports.promisify = function promisify(f, ctx) {
    return function() {
        const args = [], args_i = arguments.length; while(args_i--) args[args_i] = arguments[args_i];

        return new Promise((resolve, reject) => {
            args.push((err, result) => err ? reject(err) : resolve(result));
            f.apply(ctx, args);
        });
    };
};
