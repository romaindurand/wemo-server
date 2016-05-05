/**
 * Main application routes
 */

'use strict';

module.exports = function (app) {
  // Insert routes below
  app.use('/api/things', require('./api/thing'));
  app.use('/api/example', require('./api/example'));

  app.use('/api/wemo', require('./api/wemo'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api)/*')
    .get((req, res) => {
      res.status(404).json({message: 'Not found'});
    });

  // All other routes should redirect to the 'Hello World!'
  app.route('/*')
    .get((req, res) => {
      res.status(200).json({message: 'Hello World!'});
    });
};
