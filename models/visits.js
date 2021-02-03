const knex = require('knex');
const config = require('../knexfile');
const db = knex(config.development);

exports.addVisit = async (visit) => {
  const url = parseInt(visit.urlId, 10);
  const [id] = await db('visits').where({ urlId: url }).insert(visit);
  const newVisit = exports.findVisitById(id);
  return newVisit;
};

exports.findVisitById = async (id) => {
  const result = await db('visits').where({ id }).first();
  return result;
};

exports.fullStats = (shortUrl) => {
  return db('urls')
    .leftJoin('visits', 'urls.id', 'urlId')
    .select('urls.id as id', 'shortUrl', 'fullUrl', 'createdAt')
    .where({ shortUrl: shortUrl })
    .count({ clicks: 'urls.id' })
    .max('visits.date', { as: 'lastVisit' });
};

exports.datesOfVisits = (id) => {
  return db('visits').select('date').where({ urlId: id }).orderBy('date');
};
