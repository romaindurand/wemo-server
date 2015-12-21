'use strict';

const test = require('ava');
const request = require('supertest');

const chai = require('chai');
chai.should();
chai.use(require('sinon-chai'));

const app = require('../..');

const User = require('./user.model');

let user;
let token;

test.before(() => User.removeAsync().then(() => {
  user = new User({
    name: 'Fake User',
    email: 'test@example.com',
    password: 'password'
  });

  return user.saveAsync();
}));

test.after(() => User.removeAsync());

test.serial.cb('User API GET /auth/local should respond with token', t => {
  request(app)
    .post('/auth/local')
    .send({
      email: 'test@example.com',
      password: 'password'
    })
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) {
        return t.end(err);
      }
      token = res.body.token;

      t.ok(token);
      t.end();
    });
});

test.serial.cb('User API GET /api/users/me should respond with a user profile when authenticated', t => {
  request(app)
  .get('/api/users/me')
    .set('authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if (err) {
        return t.end(err);
      }

      t.is(res.body._id, user._id.toString());
      t.end();
    });
});

test.serial.cb('User API GET /api/users/me should respond with a 401 when not authenticated', t => {
  request(app)
  .get('/api/users/me')
    .expect(401)
    .end(t.end);
});
