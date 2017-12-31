'use strict';

var NequiResource = require('../NequiResource');
var nequiMethod = NequiResource.method;

module.exports = NequiResource.extend({

  path: '',

  unregisteredPayment: nequiMethod({
    method: 'POST',
    path: '-services-paymentservice-unregisteredpayment',
    channel: 'PNP04-C001',
    service: {
      name: 'PaymentsService',
      operation: 'unregisteredPayment'
    }
  }),

  getStatusPayment: nequiMethod({
    method: 'POST',
    path: '-services-paymentservice-getstatuspayment',
    channel: 'PNP04-C001',
    service: {
      name: 'PaymentsService',
      operation: 'getStatusPayment'
    }
  }),

  reverseTransaction: nequiMethod({
    method: 'POST',
    path: '-services-reverseservices-reversetransaction',
    channel: 'PNP04-C001',
    service: {
      name: 'ReverseServices',
      operation: 'reverseTransaction'
    },
    dataRoot: 'reversion'
  }),

});
