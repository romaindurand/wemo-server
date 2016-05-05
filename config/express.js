/**
 * Express configuration
 */

'use strict';

const morgan = require('morgan');
const compression = require('compression');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const errorHandler = require('errorhandler');

module.exports = function (app) {
  const env = app.get('env');

  app.use(compression());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());

  if (env === 'production') {
    app.use(morgan('dev'));
  }

  if (env === 'development' || env === 'test') {
    app.use(morgan('dev'));
    // Error handler - has to be last
    app.use(errorHandler());
  }
};
