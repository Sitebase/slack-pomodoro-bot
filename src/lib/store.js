const _ = require('lodash');
const low = require('lowdb');
const db = low('db.json')

db.defaults({}).value();

/**
 * Store client
 *
 * @param table The table to use for this store instance
 */
const Store = function(table) {
    if (this.constructor !== Store)
        return new Store(table);

    if (!db.get(table).value()) {
        db.set(table, {}).value();
    }

    this.table = table;
    this.db = db.get(table);
}

/**
 * List records
 *
 * @param key string For records with composed keys, filter by parts
 *
 */
Store.prototype.list = function(key) {
    const all = this.db.pickBy((v, k) => _.startsWith(k, key)).value();

    return Promise.resolve(all);
}


/**
 * Find a record by key
 *
 * @param key mixed The primary key for the record
 *
 */
Store.prototype.get = function(key) {
    key = _.isArray(key) ? key.join('::') : key;
    return Promise.resolve(this.db.get(key).value());
}

/**
 * Set a record by key
 *
 * @param key mixed The primary key for the record
 *
 */
Store.prototype.set = function(key, value) {
    key = _.isArray(key) ? key.join('::') : key;
    this.db.set(key, value).value();

    return Promise.resolve(this.db.get(key).value());
}

/**
 * Set a record by key
 *
 * @param key mixed The primary key for the record
 *
 */
Store.prototype.delete = function(key) {
    key = _.isArray(key) ? key.join('::') : key;
    this.db.unset(key).value();

    return Promise.resolve();
}

module.exports = Store;
