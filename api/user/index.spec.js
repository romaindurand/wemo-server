/* eslint-disable no-unused-expressions */

'use strict';

const sinon = require('sinon');
const chai = require('chai');
chai.should();
chai.use(require('sinon-chai'));

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

describe('User API Router:', () => {
  it('should return an express router instance', () => {
    userIndex.should.equal(routerStub);
  });

  describe('GET /api/users', () => {
    it('should verify admin role and route to user.controller.index', () => {
      routerStub.get
        .withArgs('/', 'authService.hasRole.admin', 'userCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should verify admin role and route to user.controller.destroy', () => {
      routerStub.delete
        .withArgs('/:id', 'authService.hasRole.admin', 'userCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/users/me', () => {
    it('should be authenticated and route to user.controller.me', () => {
      routerStub.get
        .withArgs('/me', 'authService.isAuthenticated', 'userCtrl.me')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/users/:id/password', () => {
    it('should be authenticated and route to user.controller.changePassword', () => {
      routerStub.put
        .withArgs('/:id/password', 'authService.isAuthenticated', 'userCtrl.changePassword')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/users/:id', () => {
    it('should be authenticated and route to user.controller.show', () => {
      routerStub.get
        .withArgs('/:id', 'authService.isAuthenticated', 'userCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/users', () => {
    it('should route to user.controller.create', () => {
      routerStub.post
        .withArgs('/', 'userCtrl.create')
        .should.have.been.calledOnce;
    });
  });
});
