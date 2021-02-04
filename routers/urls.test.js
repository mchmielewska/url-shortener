process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

chai.use(chaiHttp);
chai.should();

const db = require('../db-config');

describe('API Routes', () => {
  beforeEach(function (done) {
    db.migrate.rollback().then(function () {
      db.migrate.latest().then(function () {
        return db.seed.run().then(function () {
          done();
        });
      });
    });
  });

  afterEach(function (done) {
    db.migrate.rollback().then(function () {
      done();
    });
  });

  describe('GET /', () => {
    it('Should return all urls', (done) => {
      chai
        .request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.should.have.length(3);
          done();
        });
    });
  });

  describe('GET /:shortcode', () => {
    it('Should redirect to full url matching given shortcode and add a click to db', (done) => {
      chai
        .request(server)
        .get('/x79iW0')
        .redirects(0)
        .end((err, res) => {
          chai
            .request(server)
            .get('/x79iW0/stats')
            .end((err, res) => {
              res.body.clicks.should.eq(3);
            });
          res.should.redirectTo('https://redux.js.org/style-guide/style-guide');
          done();
        });
    });

    it('Should return error message if there is no matching shortcode in db', (done) => {
      chai
        .request(server)
        .get('/x7sfsg')
        .end((err, res) => {
          res.should.be.json;
          res.body.should.have.property('message');
          res.body.message.should.equal('Shortcode not found');
          res.should.have.status(404);
          done();
        });
    });
  });

  describe('GET /:shortcode/stats', () => {
    it('Should return stats for the given shortcode - if shortcode was visited there should be last visit date', (done) => {
      chai
        .request(server)
        .get('/x79iW0/stats')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.have.property('shortUrl');
          res.body.shortUrl.should.equal('x79iW0');
          res.body.should.have.property('fullUrl');
          res.body.fullUrl.should.equal(
            'https://redux.js.org/style-guide/style-guide'
          );
          res.body.should.have.property('createdAt');
          res.body.createdAt.should.equal('2021-02-03 12:56:35');
          res.body.should.have.property('clicks');
          res.body.clicks.should.equal(2);
          res.body.should.have.property('lastVisit');
          res.body.lastVisit.should.equal('2021-02-03 14:54:34');
          done();
        });
    });

    it('Should return stats for the given shortcode - if shortcode was not visited yet there should be no data for last visit and clicks', (done) => {
      chai
        .request(server)
        .get('/7QQ4r3/stats')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.have.property('shortUrl');
          res.body.shortUrl.should.equal('7QQ4r3');
          res.body.should.have.property('fullUrl');
          res.body.fullUrl.should.equal(
            'https://dev.to/rukykf/integration-testing-with-nodejs-jest-knex-and-sqlite-in-memory-databases-2ila'
          );
          res.body.should.have.property('createdAt');
          res.body.createdAt.should.equal('2021-02-03 13:00:19');
          res.body.should.have.property('clicks');
          res.body.clicks.should.equal(0);
          res.body.should.have.property('lastVisit');
          done();
        });
    });
  });

  describe('POST /', () => {
    it('Should add a record if the data is provided and valid (only full url)', (done) => {
      chai
        .request(server)
        .post('/')
        .send({
          fullUrl:
            'https://mherman.org/blog/test-driven-development-with-node/',
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.id.should.equal(4);
          res.body.should.have.property('shortUrl');
          res.body.should.have.property('fullUrl');
          res.body.fullUrl.should.equal(
            'https://mherman.org/blog/test-driven-development-with-node/'
          );
          res.body.should.have.property('createdAt');
          done();
        });
    });

    it('Should not add a record and send error as response if the data is not provided', (done) => {
      chai
        .request(server)
        .post('/')
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.message.should.equal('Full url not specified');
          done();
        });
    });

    it('Should add a record if the data is provided and valid - full url and unique shortcode matching the criteria', (done) => {
      chai
        .request(server)
        .post('/')
        .send({
          fullUrl:
            'https://mherman.org/blog/test-driven-development-with-node/',
          shortUrl: 'abcdef',
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.id.should.equal(4);
          res.body.should.have.property('shortUrl');
          res.body.shortUrl.should.equal('abcdef');
          res.body.should.have.property('fullUrl');
          res.body.fullUrl.should.equal(
            'https://mherman.org/blog/test-driven-development-with-node/'
          );
          res.body.should.have.property('createdAt');
          done();
        });
    });

    it('Should not add a record if the data is provided, but not valid - shortcode is too short', (done) => {
      chai
        .request(server)
        .post('/')
        .send({
          fullUrl:
            'https://mherman.org/blog/test-driven-development-with-node/',
          shortUrl: 'abc',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.should.be.json;
          res.body.message.should.equal(
            'Shortcode is not valid, only numbers and letters allowed. Length - minumum 4 characters'
          );
          done();
        });
    });

    it('Should not add a record if the data is provided, but not valid - shortcode contains special characters', (done) => {
      chai
        .request(server)
        .post('/')
        .send({
          fullUrl:
            'https://mherman.org/blog/test-driven-development-with-node/',
          shortUrl: 'abc&8-',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.should.be.json;
          res.body.message.should.equal(
            'Shortcode is not valid, only numbers and letters allowed. Length - minumum 4 characters'
          );
          done();
        });
    });

    it('Should not add a record if the data is provided, but not valid - shortcode is already used', (done) => {
      chai
        .request(server)
        .post('/')
        .send({
          fullUrl:
            'https://mherman.org/blog/test-driven-development-with-node/',
          shortUrl: 'x79iW0',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.should.be.json;
          res.body.message.should.equal('Shortcode already in use');
          done();
        });
    });
  });
});

describe('API Routes - failed DB connection', () => {
  describe('GET /', () => {
    it('Should not return all urls - only error message', (done) => {
      chai
        .request(server)
        .get('/')
        .end((err, res) => {
          res.should.be.json;
          res.body.should.have.property('message');
          res.body.message.should.equal('Unable to retrieve all records');
          res.should.have.status(500);
          done();
        });
    });
  });

  describe('GET /:shortcode', () => {
    it('Should not redirect to full url matching given shortcode and add a click to db', (done) => {
      chai
        .request(server)
        .get('/x79iW0')
        .end((err, res) => {
          chai
            .request(server)
            .get('/x79iW0/stats')
            .end((err, res) => {
              res.should.be.json;
              res.body.should.have.property('message');
              res.body.message.should.equal('Unable to perform operation');
              res.should.have.status(500);
            });
          done();
        });
    });

    it('Should return error message if there is no matching shortcode in db', (done) => {
      chai
        .request(server)
        .get('/x7sfsg')
        .end((err, res) => {
          res.should.be.json;
          res.body.should.have.property('message');
          res.body.message.should.equal('Shortcode not found');
          res.should.have.status(404);
          done();
        });
    });
  });

  describe('GET /:shortcode/stats', () => {
    it('Should not return stats for the given shortcode - if shortcode was visited there should be last visit date', (done) => {
      chai
        .request(server)
        .get('/x79iW0/stats')
        .end((err, res) => {
          res.should.have.status(500);
          res.should.be.json;
          res.body.should.have.property('message');
          res.body.message.should.equal('Unable to perform operation');
          done();
        });
    });

    it('Should not return stats for the given shortcode - if shortcode was not visited yet there should be no data for last visit and clicks', (done) => {
      chai
        .request(server)
        .get('/7QQ4r3/stats')
        .end((err, res) => {
          res.should.have.status(500);
          res.should.be.json;
          res.body.should.have.property('message');
          res.body.message.should.equal('Unable to perform operation');
          done();
        });
    });
  });

  describe('POST /', () => {
    it('Should not add a record if the data is provided and valid (only full url)', (done) => {
      chai
        .request(server)
        .post('/')
        .send({
          fullUrl:
            'https://mherman.org/blog/test-driven-development-with-node/',
        })
        .end((err, res) => {
          res.should.have.status(500);
          res.should.be.json;
          done();
        });
    });

    it('Should not add a record and send error as response if the data is not provided', (done) => {
      chai
        .request(server)
        .post('/')
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.json;
          res.body.should.have.property('message');
          res.body.message.should.equal('Full url not specified');
          done();
        });
    });

    it('Should not add a record if the data is provided and valid - full url and unique shortcode matching the criteria', (done) => {
      chai
        .request(server)
        .post('/')
        .send({
          fullUrl:
            'https://mherman.org/blog/test-driven-development-with-node/',
          shortUrl: 'abcdef',
        })
        .end((err, res) => {
          res.should.have.status(500);
          res.should.be.json;
          res.body.should.have.property('message');
          res.body.message.should.equal('Cannot add url');
          done();
        });
    });

    it('Should not add a record if the data is provided, but not valid - shortcode is too short', (done) => {
      chai
        .request(server)
        .post('/')
        .send({
          fullUrl:
            'https://mherman.org/blog/test-driven-development-with-node/',
          shortUrl: 'abc',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.should.be.json;
          res.body.message.should.equal(
            'Shortcode is not valid, only numbers and letters allowed. Length - minumum 4 characters'
          );
          done();
        });
    });

    it('Should not add a record if the data is provided, but not valid - shortcode contains special characters', (done) => {
      chai
        .request(server)
        .post('/')
        .send({
          fullUrl:
            'https://mherman.org/blog/test-driven-development-with-node/',
          shortUrl: 'abc&8-',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.should.be.json;
          res.body.message.should.equal(
            'Shortcode is not valid, only numbers and letters allowed. Length - minumum 4 characters'
          );
          done();
        });
    });

    it('Should not add a record if the data is provided, but not valid - shortcode is already used', (done) => {
      chai
        .request(server)
        .post('/')
        .send({
          fullUrl:
            'https://mherman.org/blog/test-driven-development-with-node/',
          shortUrl: 'x79iW0',
        })
        .end((err, res) => {
          res.should.have.status(500);
          res.should.be.json;
          res.body.should.have.property('message');
          res.body.message.should.equal('Cannot add url');
          done();
        });
    });
  });
});
