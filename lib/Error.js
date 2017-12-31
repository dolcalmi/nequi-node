'use strict';

var utils = require('./utils');

module.exports = _Error;

/**
 * Generic Error klass to wrap any errors returned by nequi-node
 */
function _Error(raw) {
  this.populate.apply(this, arguments);
  this.stack = (new Error(this.message)).stack;
}

// Extend Native Error
_Error.prototype = Object.create(Error.prototype);

_Error.prototype.type = 'GenericError';
_Error.prototype.populate = function(type, message) {
  this.type = type;
  this.message = message;
};

_Error.extend = utils.protoExtend;

/**
 * Create subclass of internal Error klass
 * (Specifically for errors returned from Nequi's REST API)
 */
var NequiError = _Error.NequiError = _Error.extend({
  type: 'NequiError',
  populate: function(raw) {
    // Move from prototype def (so it appears in stringified obj)
    this.type = this.type;

    this.stack = (new Error(raw.message)).stack;
    this.rawType = raw.type;
    this.code = raw.code;
    this.param = raw.param;
    this.message = raw.message;
    this.detail = raw.detail;
    this.raw = raw;
    this.headers = raw.headers;
    this.requestId = raw.requestId;
    this.statusCode = raw.statusCode;
  },
});

/**
 * Helper factory which takes raw nequi errors and outputs wrapping instances
 */
NequiError.generate = function(rawNequiError) {
  switch (rawNequiError.type) {
    case 'invalid_request_error':
      return new _Error.NequiInvalidRequestError(rawNequiError);
    case 'api_error':
      return new _Error.NequiAPIError(rawNequiError);
    case 'idempotency_error':
      return new _Error.NequiIdempotencyError(rawNequiError);
  }
  return new _Error('Generic', 'Unknown Error');
};

// Specific Nequi Error types:
_Error.NequiInvalidRequestError = NequiError.extend({type: 'NequiInvalidRequestError'});
_Error.NequiAPIError = NequiError.extend({type: 'NequiAPIError'});
_Error.NequiAuthenticationError = NequiError.extend({type: 'NequiAuthenticationError'});
_Error.NequiPermissionError = NequiError.extend({type: 'NequiPermissionError'});
_Error.NequiRateLimitError = NequiError.extend({type: 'NequiRateLimitError'});
_Error.NequiConnectionError = NequiError.extend({type: 'NequiConnectionError'});
_Error.NequiSignatureVerificationError = NequiError.extend({type: 'NequiSignatureVerificationError'});
_Error.NequiIdempotencyError = NequiError.extend({type: 'NequiIdempotencyError'});
