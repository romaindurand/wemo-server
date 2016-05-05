'use strict';

const _merge = require('lodash.merge');

// All configurations will extend these options
// ============================================
const all = {
  env: process.env.NODE_ENV,

  // Server port
  port: process.env.PORT || 9000,

  // Server IP
  ip: process.env.IP || '0.0.0.0'
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _merge(
  all,
  require(`./${process.env.NODE_ENV}.js`) || {});
