'use strict';

var nequi = require('../testUtils').getSpyableNequi();
var expect = require('chai').expect;
var DEFAULT_PATH = 'payments/v1/';

describe('QrPayments Resource', function() {

  describe('create', function() {
    it('Sends the correct request', function() {
      nequi.qrPayments.create({
        phoneNumber: '3009871234',
        value: '100'
      });

      expect(nequi.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        path: DEFAULT_PATH + '-services-paymentservice-generatecodeqr',
        data: {
          channel: 'PQR03-C001',
          service: {
            name: 'PaymentsService',
            operation: 'generateCodeQR'
          },
          body: {
            generateCodeQRRQ: {
              phoneNumber: '3009871234',
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
      nequi.qrPayments.getStatus({
        codeQR: '350-nequi-node-7286-qAppP9f1z6'
      });

      expect(nequi.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        path: DEFAULT_PATH + '-services-paymentservice-getstatuspayment',
        data: {
          channel: 'PQR03-C001',
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
      nequi.qrPayments.reverse({
        phoneNumber: '3009871234',
        value: '13',
        code: '1',
        messageId: '700738551',
        type: 'payment'
      });

      expect(nequi.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        path: DEFAULT_PATH + '-services-reverseservices-reversetransaction',
        data: {
          channel: 'PQR03-C001',
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
