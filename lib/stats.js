const visits = require('../models/visits');

exports.getStatsForShortcode = async (shortUrl, res) => {
  await visits
    .fullStats(shortUrl)
    .then((data) => {
      if (data.lastVisit != null) {
        res.status(200).json(data);
      } else {
        res.status(404).json({
          message: 'Shortcode has not been used, no stats are available',
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: 'Unable to perform operation' });
    });
};

exports.getDates = (id) => {
  visits
    .datesOfVisits(id)
    .then((data) => {
      if (data) {
        res.status(200).json(data);
      } else {
        res.status(404).json({
          message: 'Shortcode has not been used, no stats are available',
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: 'Unable to perform operation' });
    });
};
