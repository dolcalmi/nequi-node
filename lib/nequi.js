'use strict';

Nequi.DEFAULT_HOST = 'a7zgalw2j0.execute-api.us-east-1.amazonaws.com';
Nequi.DEFAULT_PORT = '443';
Nequi.DEFAULT_BASE_PATH = '/qa/';
Nequi.DEFAULT_API_VERSION = null;

// Use node's default timeout:
Nequi.DEFAULT_TIMEOUT = require('http').createServer().timeout;

Nequi.PACKAGE_VERSION = require('../package.json').version;

var EventEmitter = require('events').EventEmitter;

var resources = {
  PushPayments: require('./resources/PushPayments'),
  QrPayments: require('./resources/QrPayments'),
  SubscriptionPayments: require('./resources/SubscriptionPayments')
};

Nequi.resources = resources;

function Nequi(accessKey, secretKey, apiKey) {
  if (!(this instanceof Nequi)) {
    return new Nequi(accessKey, secretKey, apiKey);
  }

  Object.defineProperty(this, '_emitter', {
    value: new EventEmitter(),
    enumerable: false,
    configurable: false,
    writeable: false,
  });

  this.on = this._emitter.on.bind(this._emitter);
  this.off = this._emitter.removeListener.bind(this._emitter);

  this._api = {
    auth: {
      accessKey: accessKey,
      secretKey: secretKey
    },
    host: Nequi.DEFAULT_HOST,
    port: Nequi.DEFAULT_PORT,
    basePath: Nequi.DEFAULT_BASE_PATH,
    version: Nequi.DEFAULT_API_VERSION,
    timeout: Nequi.DEFAULT_TIMEOUT,
    apiKey: apiKey,
  };

  this._prepResources();
}

Nequi.prototype = {

  _setApiField: function(key, value) {
    this._api[key] = value;
  },

  setTimeout: function(timeout) {
    this._setApiField(
      'timeout',
      timeout == null ? Nequi.DEFAULT_TIMEOUT : timeout
    );
  },

  getApiField: function(key) {
    return this._api[key];
  },

  getConstant: function(c) {
    return Nequi[c];
  },

  _prepResources: function() {
    for (var name in resources) {
      this[
        name[0].toLowerCase() + name.substring(1)
      ] = new resources[name](this);
    }
  }
};

module.exports = Nequi;
// expose constructor as a named property to enable mocking with Sinon.JS
module.exports.Nequi = Nequi;
