const db = require('../database');
const { customAlphabet } = require('nanoid');
const alphabet =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const nanoid = customAlphabet(alphabet, 6);

exports.isShortcodeTaken = (shortUrl) => {
    console.log("!!!!!!!!!!!!! NIE")
  db.get(
    `SELECT 1 FROM urls WHERE shortUrl = ?`,
    [shortUrl],
    (err, queryResult) => {
      return queryResult !== undefined;
    }
  );
};

exports.validateShortcode = (shortUrl) => {
  let errors = [];

  if (exports.isShortcodeTaken(shortUrl)) {
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
  } while (isShortcodeTaken(shortUrl));

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
