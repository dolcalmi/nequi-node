'use strict';

require('./testUtils');

var nequi = require('./testUtils').getSpyableNequi();
var expect = require('chai').expect;

describe('NequiResource', function() {
  describe('createResourcePathWithSymbols', function() {
    it('Generates a path', function() {
      nequi.pushPayments.create({});
      var path = nequi.pushPayments.createResourcePathWithSymbols('{id}');
      expect(path).to.equal('/payments/v1/{id}');
    });
  });

  describe('setHost', function() {
    it('sets host only to resource', function() {
      nequi.dispersionPayments.setHost('localhost');
      expect(nequi.dispersionPayments.overrideHost).to.equal('localhost');
    });
  });

  describe('_defaultHeaders', function() {
    it('sets the api key header using the global API key', function() {
      var headers = nequi.pushPayments._defaultHeaders(null, 0, null);
      expect(headers['x-api-key']).to.equal('fakeApiKey');
    });
    it('sets the api key header using the specified API key', function() {
      var headers = nequi.pushPayments._defaultHeaders('anotherFakeApiKey', 0, null);
      expect(headers['x-api-key']).to.equal('anotherFakeApiKey');
    });
  });
});
