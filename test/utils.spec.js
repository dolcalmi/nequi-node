'use strict';

require('./testUtils');

var utils = require('../lib/utils');
var expect = require('chai').expect;

describe('utils', function() {
  describe('makeURLInterpolator', function() {
    it('Interpolates values into a prepared template', function() {
      var template = utils.makeURLInterpolator('/some/url/{foo}/{baz}?ok=1');

      expect(
        template({foo: 1, baz: 2})
      ).to.equal('/some/url/1/2?ok=1');

      expect(
        template({foo: '', baz: ''})
      ).to.equal('/some/url//?ok=1');

      expect(
        // Test encoding:
        template({foo: 'FOO', baz: '__::baz::__'})
      ).to.equal('/some/url/FOO/__%3A%3Abaz%3A%3A__?ok=1');
    });
  });

  describe('stringifyRequestData', function() {
    it('Handles basic types', function() {
      expect(utils.stringifyRequestData({
        a: 1,
        b: 'foo',
      })).to.equal('{"a":1,"b":"foo"}');
    });

    it('Handles deeply nested object', function() {
      expect(decodeURI(utils.stringifyRequestData({
        a: {
          b: {
            c: {
              d: 2,
            },
          },
        },
      }))).to.equal('{"a":{"b":{"c":{"d":2}}}}');
    });

    it('Handles arrays of objects', function() {
      expect(decodeURI(utils.stringifyRequestData({
        a: [
          {b: 'c'},
          {b: 'd'},
        ],
      }))).to.equal('{"a":[{"b":"c"},{"b":"d"}]}');
    })

    it('Creates a string from an object, handling shallow nested objects', function() {
      expect(utils.stringifyRequestData({
        test: 1,
        foo: 'baz',
        somethingElse: '::%&',
        nested: {
          1: 2,
          'a n o t h e r': null,
        },
      })).to.equal('{"test":1,"foo":"baz","somethingElse":"::%&","nested":{"1":2,"a n o t h e r":null}}');
    });
  });

  describe('protoExtend', function() {
    it('Provides an extension mechanism', function() {
      function A() {}
      A.extend = utils.protoExtend;
      var B = A.extend({
        constructor: function() {
          this.called = true;
        },
      });
      expect(new B()).to.be.an.instanceof(A);
      expect(new B()).to.be.an.instanceof(B);
      expect(new B().called).to.equal(true);
      expect(B.extend === utils.protoExtend).to.equal(true);
    });
  });

  describe('getDataFromArgs', function() {
    it('handles an empty list', function() {
      expect(utils.getDataFromArgs([])).to.deep.equal({});
    });
    it('handles a list with no object', function() {
      var args = [1, 3];
      expect(utils.getDataFromArgs(args)).to.deep.equal({});
      expect(args.length).to.equal(2);
    });
    it('finds the data', function() {
      var args = [{foo: 'bar'}, {api_key: 'foo'}];
      expect(utils.getDataFromArgs(args)).to.deep.equal({foo: 'bar'});
      expect(args.length).to.equal(1);
    });
  });

  describe('getOptsFromArgs', function() {
    it('handles an empty list', function() {
      expect(utils.getOptionsFromArgs([])).to.deep.equal({
        auth: {},
        channel: null,
        headers: {},
        service: null
      });
    });
    it('handles an list with no object', function() {
      var args = [1, 3];
      expect(utils.getOptionsFromArgs(args)).to.deep.equal({
        auth: {},
        channel: null,
        headers: {},
        service: null
      });
      expect(args.length).to.equal(2);
    });
    it('ignores a non-options object', function() {
      var args = [{foo: 'bar'}];
      expect(utils.getOptionsFromArgs(args)).to.deep.equal({
        auth: {},
        channel: null,
        headers: {},
        service: null
      });
      expect(args.length).to.equal(1);
    });
    it('parses an api key', function() {
      var args = [{apiKey: 'sk_test_iiiiiiiiiiiiiiiiiiiiiiii'}];
      expect(utils.getOptionsFromArgs(args)).to.deep.equal({
        auth: {
          apiKey: 'sk_test_iiiiiiiiiiiiiiiiiiiiiiii'
        },
        channel: null,
        headers: {
          'x-api-key': 'sk_test_iiiiiiiiiiiiiiiiiiiiiiii'
        },
        service: null
      });
      expect(args.length).to.equal(0);
    });
    it('parses an channel key', function() {
      var args = [{foo: 'bar'}, {channel: 'PNP04-C001'}];
      expect(utils.getOptionsFromArgs(args)).to.deep.equal({
        auth: {},
        channel: 'PNP04-C001',
        headers: {},
        service: null
      });
      expect(args.length).to.equal(1);
    });
    it('parses an idempotency key and api key and api version (with data)', function() {
      var args = [{foo: 'bar'}, {
        apiKey: 'sk_test_iiiiiiiiiiiiiiiiiiiiiiii',
        channel: 'PNP04-C001',
        service: {
          name: 'myService'
        }
      },];
      expect(utils.getOptionsFromArgs(args)).to.deep.equal({
        auth: {
          apiKey: 'sk_test_iiiiiiiiiiiiiiiiiiiiiiii'
        },
        channel: 'PNP04-C001',
        headers: {
          'x-api-key': 'sk_test_iiiiiiiiiiiiiiiiiiiiiiii'
        },
        service: {
          name: 'myService'
        }
      });
      expect(args.length).to.equal(1);
    });
    it('parses a channel and api key', function() {
      var args = [{
        apiKey: 'sk_test_iiiiiiiiiiiiiiiiiiiiiiii',
        channel: 'PNP04-C001'
      },];
      expect(utils.getOptionsFromArgs(args)).to.deep.equal({
        auth: {
          apiKey: 'sk_test_iiiiiiiiiiiiiiiiiiiiiiii'
        },
        channel: 'PNP04-C001',
        headers: {
          'x-api-key': 'sk_test_iiiiiiiiiiiiiiiiiiiiiiii'
        },
        service: null
      });
      expect(args.length).to.equal(0);
    });
  });

  describe('arrayToObject', function() {
    it('handles an empty array', function() {
      expect(utils.arrayToObject([])).to.deep.equal({});
    });
    it('handles an array of integers', function() {
      var arr = [1, 3];
      expect(utils.arrayToObject(arr)).to.deep.equal({'0': 1, '1': 3});
    });
    it('ignores passes non-array data through', function() {
      var arr = '3';
      expect(utils.arrayToObject(arr)).to.deep.equal('3');
    });
  });

  describe('secureCompare', function() {
    it('returns true given two equal things', function() {
      expect(utils.secureCompare('potato', 'potato')).to.equal(true);
    });

    it('returns false given two unequal things', function() {
      expect(utils.secureCompare('potato', 'tomato')).to.equal(false);
    });

    it('throws an error if not given two things to compare', function() {
      expect(function() { utils.secureCompare('potato'); }).to.throw();
    });
  });

  describe('removeEmpty', function() {
    it('removes empty properties and leaves non-empty ones', function() {
      expect(utils.removeEmpty({
        cat: 3,
        dog: false,
        rabbit: undefined,
        pointer: null,
      })).to.eql({
        cat: 3,
        dog: false,
      });
    });

    it('throws an error if not given two things to compare', function() {
      expect(function() { utils.removeEmpty('potato'); }).to.throw();
    });
  });
});

/* eslint-disable */
function handleConsoleWarns(doWithShimmedConsoleWarn, onWarn) {
  // Shim `console.warn`
  var _warn = console.warn;

  console.warn = onWarn;

  doWithShimmedConsoleWarn();

  // Un-shim `console.warn`
  console.warn = _warn;
}
/* eslint-enable */
