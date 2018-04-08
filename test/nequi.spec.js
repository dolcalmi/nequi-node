'use strict';

var Promise = require('bluebird');
var testUtils = require('./testUtils');
var nequi = require('../lib/nequi')(
  testUtils.getUserNequiAccessKey(),
  testUtils.getUserNequiApiKey(),
  testUtils.getUserNequiSecretKey()
);

var DEFAULT_HOST = 'a7zgalw2j0.execute-api.us-east-1.amazonaws.com';
var DEFAULT_BASE_PATH = '/qa/';
var DEFAULT_SECURITY_TOKEN = '';
var DEFAULT_CLIENT_ID = 'nequi-node';
var PAYMENT_DETAILS = {
  phoneNumber: '3009871234',
  code: '1',
  value: '100'
};

var expect = require('chai').expect;

describe('Nequi Module', function() {
  this.timeout(20000);

  describe('Set host', function() {
    it('Should define a default equal to DEFAULT_HOST', function() {
      expect(nequi.getApiField('host')).to.equal(DEFAULT_HOST);
    });
    it('Should allow me to set a custom host', function() {
      nequi.setHost('custom.nequi.co');
      expect(nequi.getApiField('host')).to.equal('custom.nequi.co');
    });
    it('Should allow me to set null or empty, to reset to the default', function() {
      nequi.setHost(null);
      expect(nequi.getApiField('host')).to.equal(DEFAULT_HOST);
      nequi.setHost('');
      expect(nequi.getApiField('host')).to.equal(DEFAULT_HOST);
    });
  });

  describe('Set base path', function() {
    it('Should define a default equal to DEFAULT_BASE_PATH', function() {
      expect(nequi.getApiField('basePath')).to.equal(DEFAULT_BASE_PATH);
    });
    it('Should allow me to set prod', function() {
      nequi.setEnvironment('prod');
      expect(nequi.getApiField('basePath')).to.equal('/prod/');
    });
    it('Should be DEFAULT_BASE_PATH if base path is not prod', function() {
      nequi.setEnvironment('qa');
      expect(nequi.getApiField('basePath')).to.equal(DEFAULT_BASE_PATH);
      nequi.setEnvironment('staging');
      expect(nequi.getApiField('basePath')).to.equal(DEFAULT_BASE_PATH);
    });
    it('Should allow me to set null or empty, to reset to the default', function() {
      nequi.setEnvironment(null);
      expect(nequi.getApiField('basePath')).to.equal(DEFAULT_BASE_PATH);
      nequi.setEnvironment('');
      expect(nequi.getApiField('basePath')).to.equal(DEFAULT_BASE_PATH);
    });
  });

  describe('Set security token', function() {
    it('Should define a default equal to DEFAULT_SECURITY_TOKEN', function() {
      expect(nequi.getApiField('securityToken')).to.equal(DEFAULT_SECURITY_TOKEN);
    });
    it('Should allow me to set a custom security token', function() {
      nequi.setSecurityToken('Custom security token');
      expect(nequi.getApiField('securityToken')).to.equal('Custom security token');
    });
    it('Should allow me to set null or empty, to reset to the default', function() {
      nequi.setSecurityToken(null);
      expect(nequi.getApiField('securityToken')).to.equal(DEFAULT_SECURITY_TOKEN);
      nequi.setSecurityToken('');
      expect(nequi.getApiField('securityToken')).to.equal(DEFAULT_SECURITY_TOKEN);
    });
  });

  describe('Set client id', function() {
    it('Should define a default equal to nequi-node', function() {
      expect(nequi.getApiField('clientId')).to.equal(DEFAULT_CLIENT_ID);
    });
    it('Should allow me to set a custom clientId', function() {
      nequi.setClientId('my-custom-id');
      expect(nequi.getApiField('clientId')).to.equal('my-custom-id');
    });
    it('Should allow me to set null or empty, to reset to the default', function() {
      nequi.setClientId(null);
      expect(nequi.getApiField('clientId')).to.equal(DEFAULT_CLIENT_ID);
      nequi.setClientId('');
      expect(nequi.getApiField('clientId')).to.equal(DEFAULT_CLIENT_ID);
    });
  });

  describe('Set timeout', function() {
    it('Should define a default equal to the node default', function() {
      expect(nequi.getApiField('timeout')).to.equal(require('http').createServer().timeout);
    });
    it('Should allow me to set a custom timeout', function() {
      nequi.setTimeout(900);
      expect(nequi.getApiField('timeout')).to.equal(900);
    });
    it('Should allow me to set null, to reset to the default', function() {
      nequi.setTimeout(null);
      expect(nequi.getApiField('timeout')).to.equal(require('http').createServer().timeout);
    });
  });

  describe('Callback support', function() {
      describe('Any given endpoint', function() {
        it('Will call a callback if successful', function() {
          return expect(new Promise(function(resolve, reject) {
            nequi.pushPayments.create(PAYMENT_DETAILS, function(err, payment) {
              resolve('Called!');
            });
          })).to.eventually.equal('Called!');
        });

        it('Given an error the callback will receive it', function() {
          return expect(new Promise(function(resolve, reject) {
            nequi.pushPayments.create(PAYMENT_DETAILS, function(err, payment) {
              if (err) {
                resolve('ErrorWasPassed');
              } else {
                reject(new Error('NoErrorPassed'));
              }
            });
          })).to.eventually.become('ErrorWasPassed');
        });
      });
    });


});
