const db = require('../database');

exports.storeUrlShort = (fullUrl, shortUrl, res) => {
  const data = {
    fullUrl: fullUrl,
    shortUrl: shortUrl,
    createdAt: Date.now(),
  };

  const sql = 'INSERT INTO urls (fullUrl, shortUrl, createdAt) VALUES (?,?,?)';
  const params = [data.fullUrl, data.shortUrl, data.createdAt];

  db.run(sql, params, (err, sqlRes) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(200).json(data);
  });
};
