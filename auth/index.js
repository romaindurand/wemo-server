'use strict';

const express = require('express');
const config = require('../config/environment');
const User = require('../api/user/user.model');

// Passport Configuration
require('./local/passport').setup(User, config);

const router = express.Router(); // eslint-disable-line babel/new-cap

router.use('/local', require('./local'));

module.exports = router;
