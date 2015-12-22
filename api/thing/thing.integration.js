'use strict';

const request = require('supertest');

const chai = require('chai');
chai.should();
chai.use(require('sinon-chai'));

const app = require('../..');

let newThing;

describe('Thing API:', () => {
  describe('GET /api/things', () => {
    let things;

    beforeEach(done => {
      request(app)
        .get('/api/things')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          things = res.body;
          done();
        });
    });

    it('should respond with JSON array', () => {
      things.should.be.instanceOf(Array);
    });
  });

  describe('POST /api/things', () => {
    beforeEach(done => {
      request(app)
        .post('/api/things')
        .send({
          name: 'New Thing',
          info: 'This is the brand new thing!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newThing = res.body;
          done();
        });
    });

    it('should respond with the newly created thing', () => {
      newThing.name.should.equal('New Thing');
      newThing.info.should.equal('This is the brand new thing!!!');
    });
  });

  describe('GET /api/things/:id', () => {
    let thing;

    beforeEach(done => {
      request(app)
        .get(`/api/things/${newThing._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          thing = res.body;
          done();
        });
    });

    afterEach(() => {
      thing = {};
    });

    it('should respond with the requested thing', () => {
      thing.name.should.equal('New Thing');
      thing.info.should.equal('This is the brand new thing!!!');
    });
  });

  describe('PUT /api/things/:id', () => {
    let updatedThing;

    beforeEach(done => {
      request(app)
        .put(`/api/things/${newThing._id}`)
        .send({
          name: 'Updated Thing',
          info: 'This is the updated thing!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          updatedThing = res.body;
          done();
        });
    });

    afterEach(() => {
      updatedThing = {};
    });

    it('should respond with the updated thing', () => {
      updatedThing.name.should.equal('Updated Thing');
      updatedThing.info.should.equal('This is the updated thing!!!');
    });
  });

  describe('DELETE /api/things/:id', () => {
    it('should respond with 204 on successful removal', done => {
      request(app)
        .delete(`/api/things/${newThing._id}`)
        .expect(204)
        .end(err => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when thing does not exist', done => {
      request(app)
        .delete(`/api/things/${newThing._id}`)
        .expect(404)
        .end(err => {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });
});
