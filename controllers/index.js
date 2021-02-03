const dataValidation = require('../lib/dataValidation');
const dataStorage = require('../lib/dataStorage');
const { getStatsForShortcode, getDates } = require('../lib/stats');
const urls = require('../models/urls');

exports.createUrl = async (req, res) => {
  let errors = [];
  let { shortUrl, fullUrl } = req.body;

  if (shortUrl) {
    errors.push(dataValidation.validateShortcode(shortUrl));
    errors.push(dataValidation.validateFullUrl(fullUrl));
    errors = errors.flat();
    if (errors.length > 0) {
      res.status(404).json({ message: errors.join(',') });
      return;
    } else {
      dataStorage.storeUrlShort(fullUrl, shortUrl, res);
    }
  } else {
    shortUrl = dataValidation.generateUniqueShortcode();
    errors.push(dataValidation.validateFullUrl(fullUrl));
    errors = errors.flat();
    if (errors.length > 0) {
      res.status(404).json({ message: errors.join(',') });
      return;
    } else {
      dataStorage.storeUrlShort(fullUrl, shortUrl, res);
    }
  }
};

exports.goToUrl = (req, res) => {
  const { shortUrl } = req.params;
  urls
    .findByShortcode(shortUrl)
    .then((url) => {
      if (url) {
        console.log(url);
        dataStorage.storeClick(url.id, res);
        res.redirect(url.fullUrl);
      } else {
        res.status(404).json({ message: 'Shortcode not found' });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: 'Unable to perform operation' });
    });
};

exports.getStats = async (req, res) => {
  const { shortUrl } = req.params;
  await getStatsForShortcode(shortUrl, res);
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

exports.deleteUrl = (req, res) => {
  const { id } = req.params;

  urls
    .remove(id)
    .then((count) => {
      if (count > 0) {
        res.status(200).json({ message: 'Successfully deleted' });
      } else {
        res.status(404).json({ message: 'Unable to locate record' });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: 'Unable to perform operation' });
    });
};
