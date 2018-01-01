'use strict';

var nequi = require('../testUtils').getSpyableNequi();
var expect = require('chai').expect;

describe('PushPayments Resource', function() {

  describe('create', function() {
    it('Sends the correct request', function() {
      nequi.pushPayments.create({
        phoneNumber: '3009871234',
        code: '1',
        value: '100'
      });

      expect(nequi.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        channel: 'PNP04-C001',
        path: '-services-paymentservice-unregisteredpayment',
        data: {
          channel: 'PNP04-C001',
          service: {
            name: 'PaymentsService',
            operation: 'unregisteredPayment'
          },
          body: {
            unregisteredPaymentRQ: {
              phoneNumber: '3009871234',
              code: '1',
              value: '100'
            }
          }
        },
        headers: {}
      });
    });
  });

  describe('getStatus', function() {
    it('Sends the correct request', function() {
      nequi.pushPayments.getStatus({
        codeQR: '350-nequi-node-7286-qAppP9f1z6'
      });

      expect(nequi.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        channel: 'PNP04-C001',
        path: '-services-paymentservice-getstatuspayment',
        data: {
          channel: 'PNP04-C001',
          service: {
            name: 'PaymentsService',
            operation: 'getStatusPayment'
          },
          body: {
            getStatusPaymentRQ: {
              codeQR: '350-nequi-node-7286-qAppP9f1z6'
            }
          }
        },
        headers: {}
      });
    });
  });

  describe('reverse', function() {
    it('Sends the correct request', function() {
      nequi.pushPayments.reverse({
        phoneNumber: '3009871234',
        value: '13',
        code: '1',
        messageId: '700738551',
        type: 'payment'
      });

      expect(nequi.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        channel: 'PNP04-C001',
        path: '-services-reverseservices-reversetransaction',
        data: {
          channel: 'PNP04-C001',
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
              type: 'payment'
            }
          }
        },
        headers: {}
      });
    });
  });

});
