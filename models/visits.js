const knex = require('knex');
const config = require('../knexfile');
const db = require("../db-config");

exports.addVisit = async (visit) => {
  const urlId = parseInt(visit.urlId, 10);
  const [id] = await db('visits').where({ urlId: urlId }).insert(visit);
  return exports.findVisitById(id);
};

exports.findVisitById = (id) => {
  return db('visits').where({ id }).first();
};

exports.fullStats = (shortUrl) => {
  return db('urls')
    .leftJoin('visits', 'urls.id', 'urlId')
    .select('urls.id as id', 'shortUrl', 'fullUrl', 'createdAt')
    .where({ shortUrl: shortUrl })
    .count({ clicks: 'visits.id' })
    .max('visits.date', { as: 'lastVisit' });
};

exports.datesOfVisits = (id) => {
  return db('visits').select('date').where({ urlId: id }).orderBy('date');
};
