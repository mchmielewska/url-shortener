const {
  validateShortcode,
  generateUniqueShortcode,
  validateFullUrl,
} = require('../lib/dataValidation');
const { storeUrlShort } = require('../lib/dataStorage');
const { getStatsForShortcode, getDates } = require('../lib/stats');
const db = require('../database');

exports.createUrl = (req, res, next) => {
  let errors = [];
  let shortUrl = req.body.shortUrl;
  let fullUrl = req.body.fullUrl;

  if (shortUrl) {
    errors.push(validateShortcode(shortUrl));
    errors.push(validateFullUrl(fullUrl));
    errors = errors.flat();
    if (errors.length > 0) {
      res.render('formresult', { errors: errors, shortUrl: '' });
      return;
    }
    storeUrlShort(fullUrl, shortUrl, res);
  } else {
    shortUrl = generateUniqueShortcode();
    errors.push(validateFullUrl(fullUrl));
    errors = errors.flat();
    if (errors.length > 0) {
      res.render('formresult', { errors: errors, shortUrl: '' });
      return;
    }
    storeUrlShort(fullUrl, shortUrl, res);
  }
};

const addClick = (id) => {
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
  });
};

exports.goToUrl = (req, res, next) => {
  const errors = [];
  if (req.params.shortUrl == 'favicon.ico') {
    return;
  } else {
    db.get(
      `SELECT * FROM urls WHERE shortURL = ?`,
      [req.params.shortUrl],
      (err, queryResult) => {
        if (err) {
          errors.push('Shortcode not found');
          res.status(404).json({ error: errors.join(',') });
          return;
        }
        addClick(queryResult.id);
        res.redirect(queryResult.fullUrl);
      }
    );
  }
};

exports.getStats = async (req, res, next) => {
  const stats = await getStatsForShortcode(req.params.shortUrl);

  const id = stats.id;
  const dates = await getDates(id);

  const data = {
    createdAt: stats.createdAt,
    lastVisit: stats.lastVisit,
    dates,
    clicks: stats.clicks,
  };

  res.status(200).json(data);
};

exports.getAllUrls = (req, res, next) => {
  const errors = [];
  const allUrls = [];
  db.each(
    `SELECT * FROM urls`,
    (err, queryResult) => {
      if (err || queryResult === undefined) {
        errors.push('Urls not found');
        res.status(404).json({ error: errors.join(',') });
        return;
      } else {
        allUrls.push(queryResult);
      }
    },
    () => {
      res.status(200).json(allUrls);
    }
  );
};
