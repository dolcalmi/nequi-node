'use strict';

var utils = require('../utils');
var NequiResource = require('../NequiResource');
var nequiMethod = NequiResource.method;

module.exports = NequiResource.extend({

  path: '',
  overrideHost: '3ptobiurt0.execute-api.us-east-1.amazonaws.com',

  create: nequiMethod({
    method: 'POST',
    path: '-services-dispersionservice-dispersefunds',
    channel: 'GLK06-C001',
    service: {
      name: 'DispersionService',
      operation: 'disperseFunds',
      messageIDFunc: function() {
        return utils.randomInt(100000000000000, 999999999999999);
      },
    },
  }),

  reverse: nequiMethod({
    method: 'POST',
    path: '-services-dispersionservice-reversedispersion',
    channel: 'GLK06-C001',
    service: {
      name: 'DispersionService',
      operation: 'reverseDispersion',
      messageIDFunc: function() {
        return utils.randomInt(100000000000000, 999999999999999);
      },
    },
  }),

});
