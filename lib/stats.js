const db = require('../database');

exports.getStatsForShortcode = (id) => {
  return new Promise(function (resolve, reject) {
    const errors = [];
    db.get(
      `SELECT urls.id, MAX(stats.date) as lastVisit, COUNT(stats.id) as clicks, urls.createdAt FROM urls
        LEFT JOIN stats ON stats.urlId = urls.id
        WHERE shortUrl = ?`,
      [id],
      (err, result) => {
        if (err || result.id == null) {
          errors.push('Shortcode not found');
          res.status(404).json({ error: errors.join(',') });
          return;
        } else {
          resolve(result);
        }
      }
    );
  });
};

exports.getDates = (id) => {
  return new Promise(function (resolve, reject) {
    let allVisits = [];
    db.each(
      `SELECT DATE date FROM stats WHERE urlId = ? ORDER BY date`,
      [id],
      (err, row) => {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        } else {
          allVisits.push(row);
        }
      },
      () => {
        const dates = allVisits.map((element) => {
          return element.date;
        });
        resolve(dates);
      }
    );
  });
};
