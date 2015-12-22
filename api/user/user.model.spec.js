/* eslint-disable no-unused-expressions */

'use strict';

const chai = require('chai');
chai.should();
chai.use(require('sinon-chai'));
chai.use(require('chai-as-promised'));

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

describe('User Model', () => {
  beforeEach(() => {
    genUser();
    return User.removeAsync();
  });

  it('should begin with no users', () => User.findAsync({}).then(result => {
    result.length.should.equal(0);
  }));

  it('should fail when saving a duplicate user', () => user.saveAsync().then(() => {
    const userDup = genUser();
    return userDup.saveAsync();
  }).should.be.rejected);

  describe('#email', () => {
    it('should fail when saving without an email', () => {
      user.email = '';
      return user.saveAsync().should.be.rejected;
    });
  });

  describe('#password', () => {
    beforeEach(() => user.saveAsync());

    it('should authenticate user if valid', () => {
      user.authenticate('password').should.be.true;
    });

    it('should not authenticate user if invalid', () => {
      user.authenticate('blah').should.not.be.true;
    });

    it('should remain the same hash unless the password is updated', () => {
      user.name = 'Test User';
      return user.saveAsync()
        .spread(currentUser => currentUser.authenticate('password')).then(result => {
          result.should.be.true;
        });
    });
  });
});
