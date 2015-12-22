'use strict';

const chai = require('chai');
chai.should();
chai.use(require('sinon-chai'));

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

describe('Thing Model:', () => {
  beforeEach(() => {
    genThing();
  });

  afterEach(() => Thing.removeAsync(thing));

  it('should save thing', () => thing.saveAsync().then(result => {
    result[0].should.deep.equal(thing);
  }));
});
