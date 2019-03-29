'use strict';

var NequiResource = require('../NequiResource');
var nequiMethod = NequiResource.method;

module.exports = NequiResource.extend({

  path: '',

  create: nequiMethod({
    method: 'POST',
    path: '-services-dispersionservice-dispersefunds',
    channel: 'GLK06-C001',
    service: {
      name: 'DispersionService',
      operation: 'disperseFunds'
    }
  }),

  reverse: nequiMethod({
    method: 'POST',
    path: '-services-dispersionservice-reversedispersion',
    channel: 'GLK06-C001',
    service: {
      name: 'DispersionService',
      operation: 'reverseDispersion'
    }
  }),

});
