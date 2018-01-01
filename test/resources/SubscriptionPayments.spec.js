'use strict';

var nequi = require('../testUtils').getSpyableNequi();
var expect = require('chai').expect;

describe('SubscriptionPayments Resource', function() {

  describe('subscribe', function() {
    it('Sends the correct request', function() {
      nequi.subscriptionPayments.subscribe({
        phoneNumber: '3009871234',
        code: '1',
        name: 'Service/Company Name'
      });

      expect(nequi.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        path: '-services-subscriptionpaymentservice-newsubscription',
        data: {
          channel: 'PDA05-C001',
          service: {
            name: 'SubscriptionPaymentService',
            operation: 'newSubscription'
          },
          body: {
            newSubscriptionRQ: {
              phoneNumber: '3009871234',
              code: '1',
              name: 'Service/Company Name'
            }
          }
        },
        headers: {}
      });
    });
  });

  describe('getSubscription', function() {
    it('Sends the correct request', function() {
      nequi.subscriptionPayments.getSubscription({
        phoneNumber: '3009871234',
        code: '1',
        token: 'NmQ0MzY3NGEtYmJkYi1iNjg0LWI4NjYtNTIwYTJmMDczNTk0'
      });

      expect(nequi.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        path: '-services-subscriptionpaymentservice-getsubscription',
        data: {
          channel: 'PDA05-C001',
          service: {
            name: 'SubscriptionPaymentService',
            operation: 'getSubscription'
          },
          body: {
            getSubscriptionRQ: {
              phoneNumber: '3009871234',
              code: '1',
              token: 'NmQ0MzY3NGEtYmJkYi1iNjg0LWI4NjYtNTIwYTJmMDczNTk0'
            }
          }
        },
        headers: {}
      });
    });
  });

  describe('create', function() {
    it('Sends the correct request', function() {
      nequi.subscriptionPayments.create({
        phoneNumber: '3009871234',
        code: '1',
        value: '100',
        token: 'NmQ0MzY3NGEtYmJkYi1iNjg0LWI4NjYtNTIwYTJmMDczNTk0'
      });

      expect(nequi.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        path: '-services-subscriptionpaymentservice-automaticpayment',
        data: {
          channel: 'PDA05-C001',
          service: {
            name: 'SubscriptionPaymentService',
            operation: 'automaticPayment'
          },
          body: {
            automaticPaymentRQ: {
              phoneNumber: '3009871234',
              code: '1',
              value: '100',
              token: 'NmQ0MzY3NGEtYmJkYi1iNjg0LWI4NjYtNTIwYTJmMDczNTk0'
            }
          }
        },
        headers: {}
      });
    });
  });

  describe('getStatus', function() {
    it('Sends the correct request', function() {
      nequi.subscriptionPayments.getStatus({
        codeQR: '350-nequi-node-7286-qAppP9f1z5'
      });

      expect(nequi.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        path: '-services-subscriptionpaymentservice-getstatuspayment',
        data: {
          channel: 'PDA05-C001',
          service: {
            name: 'PaymentsService',
            operation: 'getStatusPayment'
          },
          body: {
            getStatusPaymentRQ: {
              codeQR: '350-nequi-node-7286-qAppP9f1z5'
            }
          }
        },
        headers: {}
      });
    });
  });

  describe('reverse', function() {
    it('Sends the correct request', function() {
      nequi.subscriptionPayments.reverse({
        phoneNumber: '3009871234',
        value: '13',
        code: '1',
        messageId: '700738551',
        type: 'automaticPayment'
      });

      expect(nequi.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        path: '-services-reverseservices-reversetransaction',
        data: {
          channel: 'PDA05-C001',
          service: {
            name: 'ReverseServices',
            operation: 'reverseTransaction'
          },
          body: {
            reversionRQ: {
              phoneNumber: '3009871234',
              value: '13',
              code: '1',
              messageId: '700738551',
              type: 'automaticPayment'
            }
          }
        },
        headers: {}
      });
    });
  });

});
