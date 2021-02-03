const dataValidation = require('../lib/dataValidation');
const urls = require('../models/urls');
const visits = require('../models/visits');

exports.createUrl = async (req, res) => {
  let errors = [];
  let { shortUrl, fullUrl } = req.body;

  shortUrl = shortUrl ?? dataValidation.generateUniqueShortcode();
  
  errors.push(
    ...dataValidation.validateFullUrl(fullUrl),
    ...(await dataValidation.validateShortcode(shortUrl))
    );

  if (errors.length > 0)
    return res.status(400).json({ message: errors.join(',') });

  urls
    .add({ shortUrl, fullUrl })
    .then((url) => { res.status(200).json(url); })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: 'Cannot add url' });
    });
};

exports.goToUrl = (req, res) => {
  const { shortUrl } = req.params;
  urls
    .findByShortcode(shortUrl)
    .then((url) => {
      if (url) {
        visits.addVisit({ urlId: url.id });
        return url;
      } else {
        res.status(404).json({ message: 'Shortcode not found' });
      }
    })
    .then((url) => {
      return res.redirect(url.fullUrl);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: 'Unable to perform operation' });
    });
};

exports.getStats = (req, res) => {
  const { shortUrl } = req.params;
  
  visits
    .fullStats(shortUrl)
    .then((data) => {
      res.status(200).json(data[0]);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: 'Unable to perform operation' });
    });
};

exports.getAllUrls = (req, res) => {
  urls
    .findAll()
    .then((urls) => {
      res.status(200).json(urls);
    })
    .catch((error) => {
      res.status(500).json({ message: 'Unable to retrieve all records' });
    });
};