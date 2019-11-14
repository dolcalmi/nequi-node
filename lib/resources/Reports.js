'use strict';

var NequiResource = require('../NequiResource');
var nequiMethod = NequiResource.method;

module.exports = NequiResource.extend({

  path: 'partners/v1/',

  get: nequiMethod({
    method: 'POST',
    path: '-services-reportsservice-getreports',
    channel: 'MF-001',
    service: {
      name: 'ReportsService',
      operation: 'getReports'
    }
  }),

});
