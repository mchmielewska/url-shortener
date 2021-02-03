const urls = require('../models/urls');
const visits = require('../models/visits');

exports.storeUrlShort = (fullUrl, shortUrl, res) => {
  const data = {
    fullUrl,
    shortUrl,
  };

  urls
    .add(data)
    .then((url) => {
      res.status(200).json(url);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: 'Cannot add url' });
    });
};

exports.storeClick = (urlId, res) => {
  const newVisit = {
    urlId,
  };
  visits
    .addVisit(newVisit)
    .then((visit) => {})
    .catch((error) => {
      res.status(500).json({ message: 'Cannot add visit' });
    });
};
