'use strict';

const test = require('ava');

const app = require('../../app'); // eslint-disable-line no-unused-vars

const User = require('./user.model');
let user;

const genUser = function () {
  user = new User({
    provider: 'local',
    name: 'Fake User',
    email: 'test@example.com',
    password: 'password'
  });
  return user;
};

test.beforeEach(() => {
  genUser();
  return User.removeAsync();
});

test.after(() => User.removeAsync());

test.serial('User Model should fail when saving a duplicate user', t => {
  t.plan(1);

  return t.throws(user.saveAsync().then(() => {
    const userDup = genUser();
    return userDup.saveAsync();
  }));
});

test.serial('User Model should fail when saving without an email', t => {
  t.plan(1);

  user.email = '';
  return t.throws(user.saveAsync());
});

test.serial('User Model should authenticate user if valid', t => {
  t.plan(1);

  return user.saveAsync().then(() => {
    t.ok(user.authenticate('password'));
  });
});

test.serial('User Model should not authenticate user if invalid', t => {
  t.plan(1);

  return user.saveAsync().then(() => {
    t.notOk(user.authenticate('blah'));
  });
});

test.serial('User Model should remain the same hash unless the password is updated', t => {
  t.plan(1);

  user.name = 'Test User';

  return user.saveAsync().spread(currentUser => {
    t.ok(currentUser.authenticate('password'));
  });
});
