'use strict';

const test = require('ava');

const app = require('../../app'); // eslint-disable-line no-unused-vars

const Thing = require('./thing.model');
let thing;

const genThing = function () {
  thing = new Thing({
    name: 'Awesome Thing',
    info: 'This thing contains many legendary Unicorns',
    active: true
  });
  return thing;
};

test.beforeEach(() => {
  genThing();
});

test.afterEach(() => Thing.removeAsync(thing));

test('Thing Model should save thing', t => {
  t.plan(1);

  return thing.saveAsync().then(result => {
    t.same(result[0], thing);
  });
});
