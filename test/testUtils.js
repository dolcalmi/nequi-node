'use strict';

// NOTE: testUtils should be require'd before anything else in each spec file!

require('mocha');
// Ensure we are using the 'as promised' libs before any tests are run:
require('chai').use(require('chai-as-promised'));

var utils = module.exports = {

// accessKey, secretKey, apiKey
  getUserNequiApiKey: function() {
    var key = process.env.NEQUI_TEST_API_KEY || 'RandomApiKey';

    return key;
  },

  getUserNequiAccessKey: function() {
    var key = process.env.NEQUI_TEST_ACCESS_KEY || 'A00000000000000000Z';

    return key;
  },

  getUserNequiSecretKey: function() {
    var key = process.env.NEQUI_TEST_ACCESS_KEY || 'RandomSecretKey';

    return key;
  },

  getSpyableNequi: function() {
    // Provide a testable nequi instance
    // That is, with mock-requests built in and hookable

    var nequi = require('../lib/nequi');
    var nequiInstance = nequi('fakeAuthToken');

    nequiInstance.REQUESTS = [];

    for (var i in nequiInstance) {
      if (nequiInstance[i] instanceof nequi.NequiResource) {
        // Override each _request method so we can make the params
        // available to consuming tests (revealing requests made on
        // REQUESTS and LAST_REQUEST):
        nequiInstance[i]._request = function(method, url, data, auth, options, cb) {
          var req = nequiInstance.LAST_REQUEST = {
            method: method,
            url: url,
            data: data,
            headers: options.headers || {},
          };
          if (auth) {
            req.auth = auth;
          }
          nequiInstance.REQUESTS.push(req);
          cb.call(this, null, {});
        };
      }
    }

    return nequiInstance;
  },

  /**
   * A utility where cleanup functions can be registered to be called post-spec.
   * CleanupUtility will automatically register on the mocha afterEach hook,
   * ensuring its called after each descendent-describe block.
   */
  CleanupUtility: (function() {
    CleanupUtility.DEFAULT_TIMEOUT = 20000;

    function CleanupUtility(timeout) {
      var self = this;
      this._cleanupFns = [];
      this._nequi = require('../lib/nequi')(
        utils.getUserNequiAccessKey(),
        utils.getUserNequiApiKey(),
        utils.getUserNequiSecretKey()
      );
      afterEach(function(done) {
        this.timeout(timeout || CleanupUtility.DEFAULT_TIMEOUT);
        return self.doCleanup(done);
      });
    }

    CleanupUtility.prototype = {

      doCleanup: function(done) {
        var cleanups = this._cleanupFns;
        var total = cleanups.length;
        var completed = 0;
        for (var fn; (fn = cleanups.shift());) {
          var promise = fn.call(this);
          if (!promise || !promise.then) {
            throw new Error('CleanupUtility expects cleanup functions to return promises!');
          }
          promise.then(function() {
            // cleanup successful
            completed += 1;
            if (completed === total) {
              done();
            }
          }, function(err) {
            // not successful
            throw err;
          });
        }
        if (total === 0) {
          done();
        }
      },
      add: function(fn) {
        this._cleanupFns.push(fn);
      }
    };

    return CleanupUtility;
  }()),

  /**
  * Get a random string for test Object creation
  */
  getRandomString: function() {
    return Math.random().toString(36).slice(2);
  },

};
