const knex = require('knex');
const config = require('../knexfile');
const db = knex(config.development);

exports.add = async (url) => {
  const [id] = await db('urls').insert(url);
  const newUrl = exports.findById(id);
  return newUrl;
};

exports.findAll = () => {
  return db('urls');
};

exports.findById = async (urlId) => {
  const result = await db('urls').where({ id: urlId }).first();
  return result;
};

exports.findByShortcode = async (shortcode) => {
  const result = await db('urls').where({ shortUrl: shortcode }).first();
  return result;
};

exports.remove = (id) => {
  return db('urls').where({ id }).del();
};
