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
  populate: function(err) {
    // Move from prototype def (so it appears in stringified obj)
    this.type = this.type || 'NequiError';

    this.stack = (new Error(err.message)).stack;
    this.rawType = err.type;
    this.code = err.code;
    this.param = err.param;
    this.message = err.message;
    this.detail = err.detail;
    this.raw = err.raw;
    this.headers = err.headers;
    this.requestId = err.requestId;
    this.statusCode = err.statusCode;
  },
});

/**
* Helper factory which takes raw nequi errors and outputs wrapping instances
*/
NequiError.generate = function(rawNequiError) {
  rawNequiError.message = customMessages[rawNequiError.code] || rawNequiError.message || '';
  switch (rawNequiError.code) {
    case '3-451':
    case '3-455':
    case '11-9L':
    case '11-37L':
    case '20-08A':
    return new _Error.NequiInvalidDataError(rawNequiError);
    case '11-17L':
    case '20-05A':
    return new _Error.NequiInvalidRequestError(rawNequiError);
  }
  return new _Error.NequiAPIError(rawNequiError);
};

// Specific Nequi Error types:
_Error.NequiInvalidRequestError = NequiError.extend({type: 'NequiInvalidRequestError'});
_Error.NequiInvalidDataError = NequiError.extend({type: 'NequiInvalidDataError'});
_Error.NequiAPIError = NequiError.extend({type: 'NequiAPIError'});
_Error.NequiAuthenticationError = NequiError.extend({type: 'NequiAuthenticationError'});
_Error.NequiPermissionError = NequiError.extend({type: 'NequiPermissionError'});
_Error.NequiRateLimitError = NequiError.extend({type: 'NequiRateLimitError'});
_Error.NequiConnectionError = NequiError.extend({type: 'NequiConnectionError'});
_Error.NequiSignatureVerificationError = NequiError.extend({type: 'NequiSignatureVerificationError'});

var customMessages = {
  '2-CCSB000012': 'La cuenta del usuario se encuentra bloqueada',
  '2-CCSB000013': 'La cuenta del usuario se encuentra bloqueada',
  '3-451': 'Cliente o usuario no encontrado en base de datos',
  '3-455': 'Resgistro no encontrado en base de datos',
  '10-454': 'La transacción ha expirado',
  '10-455': 'La transacción ha sido cancelada o rechazada',
  '11-9L': 'El phoneNumber, code o transactionId no existen',
  '11-17L': 'Error de formato/parseo en alguno de los atributos del request',
  '11-18L': 'Timeout en el componente de logica de negocio',
  '11-37L': 'La cuenta de un usuario no existe',
  '20-05A': 'Cuando se hace una petición pero en el body vienen parametros incorrectos',
  '20-07A': 'Error técnico en Lambda',
  '20-08A': 'Dato no encontrado en repositorio o en dynamoDB'
};
