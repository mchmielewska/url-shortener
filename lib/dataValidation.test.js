const expect = require('chai').expect;
const sinon = require('sinon');
const validationModule = require('./dataValidation');

describe('Format validation for shortcode', () => {
  it('Should return true if shortcode is correct', () => {
    const shortcode = 'test';
    const isValid = validationModule.isFormatValid(shortcode);

    expect(isValid).to.be.true;
  });
  it('Should return false if shortcode is not correct', () => {
    const shortcode = '123';
    const isValid = validationModule.isFormatValid(shortcode);

    expect(isValid).to.be.false;
  });
});

describe('Full validation for shortcode', () => {
  describe('When shortcode is taken', () => {
    beforeEach(function () {
      sinon.stub(validationModule, 'isShortcodeTaken').returns(true);
    });

    afterEach(function () {
      validationModule.isShortcodeTaken.restore();
    });

    it('Should return two errors when code is too short', () => {
      const shortcode = '123';

      const errors = validationModule.validateShortcode(shortcode);

      expect(errors).to.have.length(2);
    });
    it('Should return code taken error when code is valid', () => {
      const shortcode = '1234';

      const errors = validationModule.validateShortcode(shortcode);

      expect(errors).deep.to.equal(['Shortcode already in use']);
    });
  });
});

describe('Full url validation', () => {
  it('Should not return errors if user provides url', () => {
    const url = 'http://test.test';
    const isValid = validationModule.validateFullUrl(url);

    expect(isValid).to.have.length(0);
  });
  it('Should return error if url is not provided', () => {
    const url = '';
    const isValid = validationModule.validateFullUrl(url);

    expect(isValid).to.have.length(1);
    expect(isValid[0]).to.be.equal('Full url not specified');
  });
});
