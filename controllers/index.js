const { customAlphabet } = require('nanoid');
const db = require('../database');
const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 6);
const _ = require('lodash');

const storeUrlShort = (fullUrl, shortUrl, res) => {
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
    // res.json({
    //   message: 'Success!',
    //   data: data,
    //   id: this.lastID,
    // });
  });

  res.redirect('/');
};

exports.createUrl = (req, res, next) => {
  const errors = [];
  let shortUrl;
  db.serialize(() => {
    if (!req.body.fullUrl) {
      errors.push('Full url not specified');
    }
    if (req.body.shortUrl && req.body.shortUrl.length < 4) {
      errors.push(
        'Shortcode is too short, it has to be at least 4 characters long'
      );
    }

    if (req.body.shortUrl) {
      db.get(
        `SELECT 1 FROM urls WHERE shortUrl = ?`,
        [req.body.shortUrl],
        (err, queryResult) => {
          if (queryResult !== undefined) {
            errors.push('Shortcode already in use');
            res.status(400).json({ error: errors.join(',') });
            return;
          } else {
            shortUrl = req.body.shortUrl;
            storeUrlShort(req.body.fullUrl, shortUrl, res);
          }
        }
      );
    } else {
      if (errors.length) {
        res.status(400).json({ error: errors.join(',') });
        return;
      }

      shortUrl = nanoid();
      storeUrlShort(req.body.fullUrl, shortUrl, res);
    }
  });
};

const addClick = (id, url, res) => {
  const data = {
    urlId: id,
    date: Date.now(),
  };

  const sql = 'INSERT INTO stats (urlId, date) VALUES (?,?)';
  const params = [data.urlId, data.date];

  db.run(sql, params, (err, sqlRes) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    // res.json({
    //     message: 'Success!',
    //     data: data,
    //     id: this.lastID,
    //   });

    res.redirect(url);
  });
};

exports.goToUrl = (req, res, next) => {
  const errors = [];
  db.get(
    `SELECT * FROM urls WHERE shortURL = ?`,
    [req.params.shortUrl],
    (err, queryResult) => {
      if (err) {
        errors.push('Shortcode not found');
        res.status(404).json({ error: errors.join(',') });
        return;
      }

      addClick(queryResult.id, queryResult.fullUrl, res);
    }
  );
};

exports.getStats = (req, res, next) => {
  const errors = [];
  db.get(
    `SELECT * FROM urls WHERE shortURL = ?`,
    [req.params.shortUrl],
    (err, queryResult) => {
      if (err || queryResult === undefined) {
        errors.push('Shortcode not found');
        res.status(404).json({ error: errors.join(',') });
        return;
      } else {
        const createdAt = queryResult.createdAt;
        const allVisits = [];
        db.each(
          `SELECT * FROM stats WHERE urlId = ? ORDER BY date`,
          [queryResult.id],
          (err, row) => {
            if (err) {
              res.status(400).json({ error: err.message });
              return;
            } else {
              allVisits.push(row);
            }
          },
          () => {
            const stats = _.map(allVisits, (element) =>
              _.pick(element, ['date'])
            );
            const dates = stats.map((element) => {
              return element.date;
            });
            const lastVisit = dates[dates.length - 1];
            const clicksCount = stats.length;
            const response = {
              createdAt,
              lastVisit,
              dates,
              clicksCount,
            };
            res.send(response);
          }
        );
      }
    }
  );
};
