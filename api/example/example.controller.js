/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/examples              ->  index
 * GET     /api/examples/:id          ->  show
 */

'use strict';

// Gets a list of Exs
exports.index = function (req, res) {
  res.status(200).json({message: 'Hello Wilson!'});
};

// Gets a single Ex from the DB
exports.show = function (req, res) {
  res.status(200).json({message: `Hello ${req.params.id} !`});
};
