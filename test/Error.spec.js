'use strict';

require('./testUtils');

var Error = require('../lib/Error');
var expect = require('chai').expect;

describe('Error', function() {
  it('Populates with type and message params', function() {
    var e = new Error('FooError', 'Foo happened');
    expect(e).to.have.property('type', 'FooError');
    expect(e).to.have.property('message', 'Foo happened');
    expect(e).to.have.property('stack');
  });

  describe('NequiError', function() {
    it('Generates specific instance depending on error-type', function() {
      expect(Error.NequiError.generate({code: '3-451'})).to.be.instanceOf(Error.NequiInvalidDataError);
      expect(Error.NequiError.generate({code: '3-455'})).to.be.instanceOf(Error.NequiInvalidDataError);
      expect(Error.NequiError.generate({code: '11-9L'})).to.be.instanceOf(Error.NequiInvalidDataError);
      expect(Error.NequiError.generate({code: '11-37L'})).to.be.instanceOf(Error.NequiInvalidDataError);
      expect(Error.NequiError.generate({code: '20-08A'})).to.be.instanceOf(Error.NequiInvalidDataError);

      expect(Error.NequiError.generate({code: '11-17L'})).to.be.instanceOf(Error.NequiInvalidRequestError);
      expect(Error.NequiError.generate({code: '20-05A'})).to.be.instanceOf(Error.NequiInvalidRequestError);

      expect(Error.NequiError.generate({code: ''})).to.be.instanceOf(Error.NequiAPIError);
    });

    it('Pulls in headers', function() {
      var headers = {'Request-Id': '123'};
      var e = Error.NequiError.generate({code: '3-451', headers: headers});
      expect(e).to.have.property('headers', headers);
    });

    it('Pulls in request IDs', function() {
      var e = Error.NequiError.generate({code: '', requestId: 'foo'});
      expect(e).to.have.property('requestId', 'foo');
    });

    it('Pulls in HTTP status code', function() {
      var e = Error.NequiError.generate({code: '', statusCode: 400});
      expect(e).to.have.property('statusCode', 400);
    });
  });
});
