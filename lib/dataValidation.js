const urls = require('../models/urls');
const { customAlphabet } = require('nanoid');
const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const nanoid = customAlphabet(alphabet, 6);

exports.isShortcodeTaken = (shortUrl) => {
  return urls
    .findByShortcode(shortUrl)
    .then((url) => { return url !== undefined; })
    .catch((err) => {
        // we want to prevent the user from adding if we're not sure if the URL is taken
        console.log(err)
        return true;
    });
};

exports.validateShortcode = async (shortUrl) => {
  let errors = [];

  if (await exports.isShortcodeTaken(shortUrl) == true) {
    errors.push('Shortcode already in use');
  }

  if (!exports.isFormatValid(shortUrl)) {
    errors.push(
      'Shortcode is not valid, only numbers and letters allowed. Length - minumum 4 characters'
    );
  }

  return errors;
};

exports.generateUniqueShortcode = () => {
  let shortUrl;
  do {
    shortUrl = nanoid();
  } while (exports.isShortcodeTaken(shortUrl) == true);

  console.log(shortUrl);
  return shortUrl;
};

exports.isFormatValid = (shortUrl) => {
  const validCodeMatcher = /^[A-z0-9]{4,}$/;
  const isShortcodeValid = validCodeMatcher.test(shortUrl);
  return isShortcodeValid;
};

exports.validateFullUrl = (fullUrl) => {
  let errors = [];
  if (!fullUrl) {
    errors.push('Full url not specified');
  }

  return errors;
};
