/**
 * Main application routes
 */

'use strict';

const errors = require('./components/errors');

module.exports = function (app) {
  // Insert routes below
  app.use('/api/things', require('./api/thing'));
  app.use('/api/example', require('./api/example'));

  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api)/*')
   .get(errors[404]);

  // All other routes should redirect to the 'Hello World!'
  app.route('/*')
    .get((req, res) => {
      res.status(200).json({message: 'Hello World!'});
    });
};
