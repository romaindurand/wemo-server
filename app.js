/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const express = require('express');
const config = require('./config/environment');

// Setup server
const app = express();
const server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, () => {
  console.log(`Express server listening on ${config.port}, in ${app.get('env')} mode`);
});

// Expose app
exports = module.exports = app;
