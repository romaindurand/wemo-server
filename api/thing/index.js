'use strict';

const express = require('express');
const controller = require('./thing.controller');

const router = express.Router(); // eslint-disable-line babel/new-cap

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
