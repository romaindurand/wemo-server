/* eslint-disable no-unused-expressions */

'use strict';

const sinon = require('sinon');
const chai = require('chai');
chai.should();
chai.use(require('sinon-chai'));

const test = require('ava');
const proxyquire = require('proxyquire').noPreserveCache();

const userCtrlStub = {
  index: 'userCtrl.index',
  destroy: 'userCtrl.destroy',
  me: 'userCtrl.me',
  changePassword: 'userCtrl.changePassword',
  show: 'userCtrl.show',
  create: 'userCtrl.create'
};

const authServiceStub = {
  isAuthenticated() {
    return 'authService.isAuthenticated';
  },
  hasRole(role) {
    return `authService.hasRole.${role}`;
  }
};

const routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
const userIndex = proxyquire('./index', {
  'express': {
    Router() {
      return routerStub;
    }
  },
  './user.controller': userCtrlStub,
  '../../auth/auth.service': authServiceStub
});

test('User API Router should return an express router instance', t => {
  t.plan(1);

  t.is(userIndex, routerStub);
});

test('User API GET /api/users should verify admin role and route to user.controller.index', t => {
  t.plan(1);

  t.ok(routerStub.get
    .withArgs('/', 'authService.hasRole.admin', 'userCtrl.index').should.have.been.calledOnce
  );
});

test('User API DELETE /api/users/:id should verify admin role and route to user.controller.destroy', t => {
  t.plan(1);

  t.ok(routerStub.delete
    .withArgs('/:id', 'authService.hasRole.admin', 'userCtrl.destroy').should.have.been.calledOnce
  );
});

test('User API GET /api/users/me should be authenticated and route to user.controller.me', t => {
  t.plan(1);

  t.ok(routerStub.get
    .withArgs('/me', 'authService.isAuthenticated', 'userCtrl.me').should.have.been.calledOnce
  );
});

test('User API PUT /api/users/:id/password', t => {
  t.plan(1);

  t.ok(routerStub.put
    .withArgs('/:id/password', 'authService.isAuthenticated', 'userCtrl.changePassword').should.have.been.calledOnce
  );
});

test('User API GET /api/users/:id should be authenticated and route to user.controller.show', t => {
  t.plan(1);

  t.ok(routerStub.get
    .withArgs('/:id', 'authService.isAuthenticated', 'userCtrl.show').should.have.been.calledOnce
  );
});

test('User API POST /api/users should route to user.controller.create', t => {
  t.plan(1);

  t.ok(routerStub.post
    .withArgs('/', 'userCtrl.create').should.have.been.calledOnce
  );
});
