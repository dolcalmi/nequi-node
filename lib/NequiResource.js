'use strict';

var http = require('http');
var https = require('https');
var path = require('path');
var aws4 = require('aws4');
var nanoid = require('nanoid')

var utils = require('./utils');
var Error = require('./Error');

var hasOwn = {}.hasOwnProperty;

// Provide extension mechanism for Nequi Resource Sub-Classes
NequiResource.extend = utils.protoExtend;

// Expose method-creator & prepared (basic) methods
NequiResource.method = require('./NequiMethod');
NequiResource.BASIC_METHODS = require('./NequiMethod.basic');

/**
 * Encapsulates request logic for a Nequi Resource
 */
function NequiResource(nequi, urlData) {
  this._nequi = nequi;
  this._urlData = urlData || {};

  this.basePath = utils.makeURLInterpolator(nequi.getApiField('basePath'));
  this.resourcePath = this.path;
  this.path = utils.makeURLInterpolator(this.path);

  if (this.includeBasic) {
    this.includeBasic.forEach(function(methodName) {
      this[methodName] = NequiResource.BASIC_METHODS[methodName];
    }, this);
  }

  this.initialize.apply(this, arguments);
}

NequiResource.prototype = {

  path: '',

  initialize: function() {},

  // Function to override the default data processor. This allows full control
  // over how a NequiResource's request data will get converted into an HTTP
  // body. This is useful for non-standard HTTP requests. The function should
  // take method name, data, and headers as arguments.
  requestDataProcessor: null,

  // String that overrides the base API endpoint. If `overrideHost` is not null
  // then all requests for a particular resource will be sent to a base API
  // endpoint as defined by `overrideHost`.
  overrideHost: null,

  // Function to add a validation checks before sending the request, errors should
  // be thrown, and they will be passed to the callback/promise.
  validateRequest: null,

  setHost: function(host) {
    this.overrideHost = host;
  },

  createFullPath: function(commandPath, urlData) {
    return path.join(
      this.basePath(urlData),
      this.path(urlData),
      typeof commandPath == 'function' ?
        commandPath(urlData) : commandPath
    ).replace(/\\/g, '/'); // ugly workaround for Windows
  },

  // Creates a relative resource path with symbols left in (unlike
  // createFullPath which takes some data to replace them with). For example it
  // might produce: /invoices/{id}
  createResourcePathWithSymbols: function(pathWithSymbols) {
    return '/' + path.join(
      this.resourcePath,
      pathWithSymbols
    ).replace(/\\/g, '/'); // ugly workaround for Windows
  },

  createUrlData: function() {
    var urlData = {};
    // Merge in baseData
    for (var i in this._urlData) {
      if (hasOwn.call(this._urlData, i)) {
        urlData[i] = this._urlData[i];
      }
    }
    return urlData;
  },

  wrapTimeout: function(promise, callback) {
    if (callback) {
      // Ensure callback is called outside of promise stack.
      return promise.then(function(res) {
        setTimeout(function() { callback(null, res) }, 0);
      }, function(err) {
        setTimeout(function() { callback(err, null); }, 0);
      });
    }

    return promise;
  },

  _timeoutHandler: function(timeout, req, callback) {
    var self = this;
    return function() {
      var timeoutErr = new Error('ETIMEDOUT');
      timeoutErr.code = 'ETIMEDOUT';

      req._isAborted = true;
      req.abort();

      callback.call(
        self,
        new Error.NequiConnectionError({
          message: 'Request aborted due to timeout being reached (' + timeout + 'ms)',
          detail: timeoutErr,
        }),
        null
      );
    }
  },

  _responseHandler: function(req, callback) {
    var self = this;
    return function(res) {
      var response = '';

      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        response += chunk;
      });
      res.on('end', function() {
        var headers = res.headers || {};
        // For convenience, make Request-Id easily accessible on
        // lastResponse.
        res.requestId = headers['x-amzn-requestid'];

        var responseEvent = utils.removeEmpty({
          api_version: headers['nequi-version'],
          account: headers['nequi-account'],
          method: req._requestEvent.method,
          path: req._requestEvent.path,
          status: res.statusCode,
          request_id: res.requestId,
          elapsed: Date.now() - req._requestStart,
        });

        self._nequi._emitter.emit('response', responseEvent);

        try {
          response = JSON.parse(response);
          res.requestId = response.ResponseMessage.ResponseHeader.MessageID;
          var status = response.ResponseMessage.ResponseHeader.Status;
          if (status.StatusCode !== '0') {
            var err;
            var error = {
              code: status.StatusCode,
              message: status.StatusDesc,
              headers: headers,
              statusCode: res.statusCode,
              requestId: response.ResponseMessage.ResponseHeader.MessageID,
              raw: response
            };

            if (res.statusCode === 401) {
              err = new Error.NequiAuthenticationError(error);
            } else if (res.statusCode === 403) {
              err = new Error.NequiPermissionError(error);
            } else if (res.statusCode === 429) {
              err = new Error.NequiRateLimitError(error);
            } else {
              err = Error.NequiError.generate(error);
            }
            return callback.call(self, err, null);
          }
        } catch (e) {
          return callback.call(
            self,
            new Error.NequiAPIError({
              message: (response && response.message) || 'Invalid JSON received from the Nequi API',
              response: response,
              exception: e,
              requestId: headers['x-amzn-requestid'],
            }),
            null
          );
        }
        // Expose res object
        Object.defineProperty(response, 'lastResponse', {
          enumerable: false,
          writable: false,
          value: res,
        });
        callback.call(self, null, response);
      });
    };
  },

  _errorHandler: function(req, callback) {
    var self = this;
    return function(error) {
      if (req._isAborted) {
        // already handled
        return;
      }
      callback.call(
        self,
        new Error.NequiConnectionError({
          message: 'An error occurred with our connection to Nequi',
          detail: error,
        }),
        null
      );
    }
  },

  _defaultHeaders: function(apiKey, contentLength, apiVersion) {
    var headers = {
      // Use specified apiKey token or use default from this nequi instance:
      'x-api-key': apiKey ? apiKey : this._nequi.getApiField('apiKey'),
      'accept': 'application/json',
      'content-type': 'application/json',
      'Content-Length': contentLength,
    };

    // if (apiVersion) {
    //   headers['Nequi-Version'] = apiVersion;
    // }

    return headers;
  },

  _request: function(method, path, data, apiKey, options, callback) {
    var self = this;
    var requestData;

    if (self.requestDataProcessor) {
      requestData = self.requestDataProcessor(method, data, options.headers);
    } else {
      data = parseBody();
      requestData = utils.stringifyRequestData(data || {});
      // console.log(JSON.stringify(data, null, 4));
    }

    var apiVersion = this._nequi.getApiField('version');

    var headers = self._defaultHeaders(apiKey, requestData.length, apiVersion);

    makeRequest();

    function randomId() {
      var rnd = nanoid.customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);
      return rnd();
    }

    function parseBody() {
      var messageIdFunc = data.service.messageIDFunc || randomId;

      var d = {
        'RequestMessage': {
          'RequestHeader': {
            'Channel': data.channel || self._nequi.getApiField('defaultChannel'),
            'RequestDate': new Date().toJSON(),
            'MessageID': messageIdFunc() + '',
            'ClientID': self._nequi.getApiField('clientId') || 'nequi-node',
            'Destination': {
              'ServiceRegion': data.service.region || self._nequi.getApiField('serviceRegion') || 'C001',
              'ServiceVersion': data.service.version || self._nequi.getApiField('serviceVersion') || '1.0.0'
            }
          },
          'RequestBody': {
            'any': data.body
          }
        }
      };
      if (data.service.name) {
        d.RequestMessage.RequestHeader.Destination.ServiceName = data.service.name;
      }

      if (data.service.operation) {
        d.RequestMessage.RequestHeader.Destination.ServiceOperation = data.service.operation;
      }

      // console.log(JSON.stringify(d, null, 4));

      return d;
    }

    function makeRequest() {
      var timeout = self._nequi.getApiField('timeout');
      var isInsecureConnection = self._nequi.getApiField('protocol') == 'http';

      var host = self.overrideHost || self._nequi.getApiField('host');
      var reqParams = {
        host: host,
        path: path,
        method: method,
        headers: headers,
        service: self._nequi.getApiField('service') || 'execute-api',
        body: requestData
      };
      var auth = self._nequi.getApiField('auth');
      var securityToken = self._nequi.getApiField('securityToken');
      options = aws4.sign(reqParams, {accessKeyId: auth.accessKey, secretAccessKey: auth.secretKey});

      // security token is added after sign
      if (securityToken) {
        options.headers['x-amz-security-token'] = securityToken;
      }
      // console.log(JSON.stringify(options, null, 4));
      var req = (
        isInsecureConnection ? http : https
      ).request(options);

      var requestEvent = utils.removeEmpty({
        api_version: apiVersion,
        account: headers['Nequi-Account'],
        method: method,
        path: path
      });

      req._requestEvent = requestEvent;

      req._requestStart = Date.now();
      self._nequi._emitter.emit('request', requestEvent);

      req.setTimeout(timeout, self._timeoutHandler(timeout, req, callback));
      req.on('response', self._responseHandler(req, callback));
      req.on('error', self._errorHandler(req, callback));

      req.on('socket', function(socket) {
        socket.on((isInsecureConnection ? 'connect' : 'secureConnect'), function() {
          // Send payload; we're safe:
          req.write(requestData);

          req.end();
        });
      });
    }
  },

};

module.exports = NequiResource;
