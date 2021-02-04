const knex = require('knex');
const config = require('./knexfile');
let db = null;

/* istanbul ignore next */
if (process.env.NODE_ENV === 'test') {
  db = knex(config.test);
} else {
  db = knex(config.development);
}

module.exports = db;
