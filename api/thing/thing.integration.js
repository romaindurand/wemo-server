'use strict';

const test = require('ava');
const request = require('supertest');

const chai = require('chai');
chai.should();
chai.use(require('sinon-chai'));

const app = require('../..');

let newThing;

test.cb('Thing API GET /api/things should respond with JSON array', t => {
  let things;
  request(app)
    .get('/api/things')
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) {
        return t.end(err);
      }
      things = res.body;
      t.ok(things.should.be.instanceOf(Array));

      t.end();
    });
});

test.serial.cb('Thing API POST /api/things should respond with the newly created thing', t => {
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
        return t.end(err);
      }
      newThing = res.body;
      t.ok(newThing.name.should.equal('New Thing'));
      t.ok(newThing.info.should.equal('This is the brand new thing!!!'));

      t.end();
    });
});

test.serial.cb('Thing API GET /api/things/:id should respond with the requested thing', t => {
  let thing;
  request(app)
    .get(`/api/things/${newThing._id}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) {
        return t.end(err);
      }
      thing = res.body;
      t.ok(thing.name.should.equal(newThing.name));
      t.ok(thing.info.should.equal(newThing.info));

      t.end();
    });
});

test.serial.cb('Thing API PUT /api/things/:id should respond with the updated thing', t => {
  let updatedThing;
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
        return t.end(err);
      }
      updatedThing = res.body;
      t.ok(updatedThing.name.should.equal('Updated Thing'));
      t.ok(updatedThing.info.should.equal('This is the updated thing!!!'));

      t.end();
    });
});

test.serial.cb('Thing API DELETE /api/things/:id should respond with 204 on successful removal', t => {
  request(app)
    .delete(`/api/things/${newThing._id}`)
    .expect(204)
    .end(err => {
      if (err) {
        return t.end(err);
      }

      t.end();
    });
});

test.serial.cb('Thing API GET /api/things/:id should respond with 404 when thing does not exist', t => {
  request(app)
    .delete(`/api/things/${newThing._id}`)
    .expect(404)
    .end(err => {
      if (err) {
        return t.end(err);
      }

      t.end();
    });
});
