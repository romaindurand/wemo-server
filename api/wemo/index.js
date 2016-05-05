'use strict';

const express = require('express');
const controller = require('./wemo.controller');

const router = express.Router(); // eslint-disable-line babel/new-cap

router.get('/switch/:name', controller.toggle);
router.get('/', controller.index);

module.exports = router;
