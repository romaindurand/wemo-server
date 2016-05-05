'use strict';

const express = require('express');
const controller = require('./wemo.controller');

const router = express.Router(); // eslint-disable-line babel/new-cap

router.get('/', controller.index);
router.get('/switch/:name', controller.toggle);

module.exports = router;
