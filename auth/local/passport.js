'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

function localAuthenticate(User, email, password, done) {
  User.findOneAsync({
    email: email.toLowerCase()
  })
    .then(user => {
      if (!user) {
        return done(null, false, {
          message: 'This email is not registered.'
        });
      }
      user.authenticate(password, (authError, authenticated) => {
        if (authError) {
          return done(authError);
        }
        if (authenticated === false) {
          return done(null, false, {
            message: 'This password is not correct.'
          });
        }

        return done(null, user);
      });
    })
    .catch(err => done(err));
}

exports.setup = function (User) {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    // This is the virtual field on the model
    passwordField: 'password'
  }, (email, password, done) => localAuthenticate(User, email, password, done)));
};
