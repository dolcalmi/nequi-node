'use strict';

var NequiResource = require('../NequiResource');
var nequiMethod = NequiResource.method;

module.exports = NequiResource.extend({

  path: '',
  overrideHost: 'tte1048ge4.execute-api.us-east-1.amazonaws.com',

  subscribe: nequiMethod({
    method: 'POST',
    path: '-services-subscriptionpaymentservice-newsubscription',
    channel: 'PDA05-C001',
    service: {
      name: 'SubscriptionPaymentService',
      operation: 'newSubscription'
    }
  }),

  getSubscription: nequiMethod({
    method: 'POST',
    path: '-services-subscriptionpaymentservice-getsubscription',
    channel: 'PDA05-C001',
    service: {
      name: 'SubscriptionPaymentService',
      operation: 'getSubscription'
    }
  }),

  create: nequiMethod({
    method: 'POST',
    path: '-services-subscriptionpaymentservice-automaticpayment',
    channel: 'PDA05-C001',
    service: {
      name: 'SubscriptionPaymentService',
      operation: 'automaticPayment'
    }
  }),

  getStatus: nequiMethod({
    method: 'POST',
    path: '-services-subscriptionpaymentservice-getstatuspayment',
    channel: 'PDA05-C001',
    service: {
      name: 'PaymentsService',
      operation: 'getStatusPayment'
    }
  }),

  reverse: nequiMethod({
    method: 'POST',
    path: '-services-reverseservices-reversetransaction',
    channel: 'PDA05-C001',
    service: {
      name: 'ReverseServices',
      operation: 'reverseTransaction'
    },
    dataRoot: 'reversion'
  }),

});
