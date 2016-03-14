'use strict';

const express = require('express');
const controller = require('./example.controller');

const router = express.Router(); // eslint-disable-line babel/new-cap

router.get('/', controller.index);
router.get('/:id', controller.show);

module.exports = router;
