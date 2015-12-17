'use strict';

const mongoose = require('bluebird').promisifyAll(require('mongoose'));
const Schema = mongoose.Schema;

const ThingSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Thing', ThingSchema);
