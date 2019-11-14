'use strict';

Nequi.DEFAULT_HOST_QA = 'api.sandbox.nequi.com';
Nequi.DEFAULT_HOST_PROD = 'api.nequi.com';
Nequi.DEFAULT_PORT = '443';
Nequi.DEFAULT_BASE_PATH = '/';
Nequi.DEFAULT_API_VERSION = null;
Nequi.DEFAULT_CLIENT_ID = 'nequi-node';
Nequi.DEFAULT_SECURITY_TOKEN = '';

// Use node's default timeout:
Nequi.DEFAULT_TIMEOUT = require('http').createServer().timeout;

Nequi.PACKAGE_VERSION = require('../package.json').version;

var EventEmitter = require('events').EventEmitter;

var resources = {
  DispersionPayments: require('./resources/DispersionPayments'),
  PushPayments: require('./resources/PushPayments'),
  QrPayments: require('./resources/QrPayments'),
  SubscriptionPayments: require('./resources/SubscriptionPayments'),
  Reports: require('./resources/Reports')
};

Nequi.NequiResource = require('./NequiResource');
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
    host: Nequi.DEFAULT_HOST_QA,
    port: Nequi.DEFAULT_PORT,
    basePath: Nequi.DEFAULT_BASE_PATH,
    version: Nequi.DEFAULT_API_VERSION,
    timeout: Nequi.DEFAULT_TIMEOUT,
    apiKey: apiKey,
    clientId: Nequi.DEFAULT_CLIENT_ID,
    securityToken: Nequi.DEFAULT_SECURITY_TOKEN,
  };

  this._prepResources();
}

Nequi.prototype = {

  _setApiField: function(key, value) {
    this._api[key] = value;
    this._prepResources();
  },

  setHost: function(host) {
    this._setApiField('host', host || Nequi.DEFAULT_HOST_QA);
  },

  setEnvironment: function(env) {
    var e = env === 'prod' ? Nequi.DEFAULT_HOST_PROD : Nequi.DEFAULT_HOST_QA;
    this._setApiField('host', e);
  },

  setBasePath: function(path) {
    this._setApiField('basePath', path || Nequi.DEFAULT_BASE_PATH);
  },

  setClientId: function(clientId) {
    this._setApiField('clientId', clientId || Nequi.DEFAULT_CLIENT_ID);
  },

  setSecurityToken: function(token) {
    this._setApiField('securityToken', token || Nequi.DEFAULT_SECURITY_TOKEN);
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
