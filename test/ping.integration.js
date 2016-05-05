'use strict';

const request = require('supertest');

const chai = require('chai');
chai.should();
chai.use(require('sinon-chai'));

const app = require('../app');

describe('wemo-server:', () => {
  it('should respond to ping', done => {
    request(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        const result = res.body;

        result.message.should.be.equal('Hello World!');

        done();
      });
  });
});
