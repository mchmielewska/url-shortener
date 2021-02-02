const db = require('../database');

exports.clicksCount = (id) => {
  return new Promise(function (resolve, reject) {
    db.get(
      `SELECT COUNT(*) AS count FROM stats WHERE urlId = ?`,
      [id],
      (err, result) => {
        if (result) {
          resolve(result.count);
        } else reject(err.message);
      }
    );
  });
};

exports.lastVisitDate = (id) => {
  return new Promise(function (resolve, reject) {
    db.get(
      `SELECT MAX(date) AS lastVisit FROM stats WHERE urlId = ?`,
      [id],
      (err, result) => {
        if (result) {
          resolve(result.lastVisit);
        } else reject(err.message);
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
