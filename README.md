# Libreria Node.js para el API de Nequi


[![Version](https://img.shields.io/npm/v/nequi.svg)](https://www.npmjs.org/package/nequi)
[![Build Status](https://api.travis-ci.org/dolcalmi/nequi-node.svg?branch=master)](https://travis-ci.org/dolcalmi/nequi-node)
[![Coveralls github](https://img.shields.io/coveralls/github/dolcalmi/nequi-node.svg)](https://coveralls.io/github/dolcalmi/nequi-node?branch=master)
[![David](https://img.shields.io/david/dolcalmi/nequi-node.svg)](https://david-dm.org/dolcalmi/nequi-node)
[![David](https://img.shields.io/david/dev/dolcalmi/nequi-node.svg)](https://david-dm.org/dolcalmi/nequi-node?type=dev)
[![Try on RunKit](https://badge.runkitcdn.com/nequi.svg)](https://runkit.com/npm/nequi)

Proporciona acceso al API de Nequi para aplicaciones Node.js

Tenga en cuenta que esta libreria es para usar del lado del servidor ya que
requiere las claves secretas de Nequi. No debe usarse directamente en el browser.

## Instalación

Instalar el paquete con:

    npm install nequi --save

## Servicios soportados

* [Pagos con Notificación][api-pushPayments]
* [Pagos con QR code][api-qrPayments]
* [Pagos con suscripción][api-subscription]

## Documentación

* [Wiki](https://github.com/dolcalmi/nequi-node/wiki).
* [Nequi](https://nequi.co).
* [Nequi API](https://docs.conecta.nequi.com.co/).

## Uso

El paquete debe configurarse con las [credenciales de su cuenta][api-keys].

``` js
var nequiClient = require('nequi')('Your Access Key', 'Your Secret Key', 'Your API Key');

var payment = await nequiClient.pushPayments.create({
  phoneNumber: '3009871234',
  code: '1',
  value: '5000'
});
```
O con versiones anteriores a Node.js v7.9

``` js
var nequiClient = require('nequi')('Your Access Key', 'Your Secret Key', 'Your API Key');

nequiClient.pushPayments.create(
  {
    phoneNumber: '3009871234',
    code: '1',
    value: '5000'
  },
  function(err, response) {
    err; // null si no hay errores
    response; // respuesta del servicio
  }
);
```
O usando modulos ES:

``` js
import nequi from 'nequi';
const nequiClient = nequi('Your Access Key', 'Your Secret Key', 'Your API Key');
//…
```

### Promesas

Cada método devuelve una promesa encadenable que se puede utilizar en lugar de un callback:

``` js
// Crea y consultar una nueva suscripción:
nequi.subscriptionPayments.subscribe({
  phoneNumber: '3009871234',
  code: '1',
  name: 'Company/Service name'
})
.then(function(subscription) {
  return nequi.subscriptionPayments.getSubscription({
    phoneNumber: '3009871234',
    code: '1',
    token: subscription.token
  });
})
.then(function(subscription) {
  // new subscription
}).catch(function(err) {
  // Deal with an error
});
```

## Desarrollo

Ejecutar pruebas:

```bash
$ npm install
$ npm test
```

Ejecutar solo un archivo:

```bash
$ npm run mocha -- test/Error.spec.js
```

Ejecutar un caso de prueba:

```bash
$ npm run mocha -- test/Error.spec.js --grep 'Populates with type'
```

<sub><sup>Desarrollo basado en la [Libreria Node.js de Stripe](https://github.com/stripe/stripe-node)</sup></sub>

[api-keys]: https://conecta.nequi.com.co/content/consultas?view=apiKey
[api-pushPayments]: https://docs.conecta.nequi.com.co/?api=unregisteredPayments
[api-qrPayments]: https://docs.conecta.nequi.com.co/?api=qrPayments
[api-subscription]: https://docs.conecta.nequi.com.co/?api=subscriptions
