'use strict';

var nequiMethod = require('./NequiMethod');

module.exports = {

  create: nequiMethod({
    method: 'POST',
  }),

  list: nequiMethod({
    method: 'GET',
  }),

  retrieve: nequiMethod({
    method: 'GET',
    path: '/{id}',
    urlParams: ['id'],
  }),

  update: nequiMethod({
    method: 'POST',
    path: '{id}',
    urlParams: ['id'],
  }),

  // Avoid 'delete' keyword in JS
  del: nequiMethod({
    method: 'DELETE',
    path: '{id}',
    urlParams: ['id'],
  }),

};
