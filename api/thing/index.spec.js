/* eslint-disable no-unused-expressions */

'use strict';

const sinon = require('sinon');
const chai = require('chai');
chai.should();
chai.use(require('sinon-chai'));

const test = require('ava');
const proxyquire = require('proxyquire').noPreserveCache();

const thingCtrlStub = {
  index: 'thingCtrl.index',
  show: 'thingCtrl.show',
  create: 'thingCtrl.create',
  update: 'thingCtrl.update',
  destroy: 'thingCtrl.destroy'
};

const routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
const thingIndex = proxyquire('./index.js', {
  'express': {
    Router() {
      return routerStub;
    }
  },
  './thing.controller': thingCtrlStub
});

test('Thing API Router should return an express router instance', t => {
  t.plan(1);

  t.is(thingIndex, routerStub);
});

test('Thing API GET /api/things should route to thing.controller.index', t => {
  t.plan(1);

  t.ok(routerStub.get
    .withArgs('/', 'thingCtrl.index').should.have.been.calledOnce
  );
});
/*
describe('Thing API Router:', () => {
  it('should return an express router instance', () => {
    thingIndex.should.equal(routerStub);
  });

  describe('GET /api/things', () => {
    it('should route to thing.controller.index', () => {
      routerStub.get
        .withArgs('/', 'thingCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/things/:id', () => {
    it('should route to thing.controller.show', () => {
      routerStub.get
        .withArgs('/:id', 'thingCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/things', () => {
    it('should route to thing.controller.create', () => {
      routerStub.post
        .withArgs('/', 'thingCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/things/:id', () => {
    it('should route to thing.controller.update', () => {
      routerStub.put
        .withArgs('/:id', 'thingCtrl.update')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/things/:id', () => {
    it('should route to thing.controller.update', () => {
      routerStub.patch
        .withArgs('/:id', 'thingCtrl.update')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/things/:id', () => {
    it('should route to thing.controller.destroy', () => {
      routerStub.delete
        .withArgs('/:id', 'thingCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
*/
