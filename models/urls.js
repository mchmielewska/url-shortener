const knex = require('knex');
const config = require('../knexfile');
const db = require('../db-config');

exports.add = async (url) => {
  const [id] = await db('urls').insert(url);
  return exports.findById(id);
};

exports.findAll = () => {
  return db('urls');
};

exports.findById = (urlId) => {
  return db('urls').where({ id: urlId }).first();
};

exports.findByShortcode = (shortcode) => {
  return db('urls')
    .where({ shortUrl: shortcode })
    .first()
    .then((row) => {
      if (!row) return Promise.reject('Record not found');

      return row;
    });
};
