process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

chai.use(chaiHttp);
chai.should();

const db = require("../db-config")

beforeEach(async () => {
  await db.migrate.latest();
})

describe('API Routes', () => {
  describe('GET /', () => {
    it('Should return all urls', (done) => {
      chai
        .request(server)
        .get('/')
        .end((err, res) => {
          console.log(res.body)
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          done();
        });
    });
  });
});
