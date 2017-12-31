# Libreria Node.js para el API de Nequi

[![Build Status](https://api.travis-ci.org/dolcalmi/nequi-node.svg?branch=master)](https://travis-ci.org/dolcalmi/nequi-node)

Proporciona acceso al API de Nequi desde aplicaciones server-side JavaScript.

Tenga en cuenta que esta libreria es para usar del lado del servidor ya que
requiere las claves secretas de Nequi. No debe usarse directamente en el browser.

## Documentación

Ver [Nequi API](https://docs.conecta.nequi.com.co/).

## Instalación

Instalar el paquete con:

    npm install nequi --save

o

    yarn add nequi

## Uso

El paquete debe configurarse con las [credenciales de su cuenta][api-keys].

``` js
var nequiClient = require('nequi')('Your Access Key', 'Your Secret Key', 'Your API Key');

var payment = await nequiClient.payments.unregisteredPayment({
  'phoneNumber': '3206657470',
  'code': '1',
  'value': '5000'
});
```
O con versiones anteriores a Node.js v7.9

``` js
var nequiClient = require('nequi')('Your Access Key', 'Your Secret Key', 'Your API Key');

nequiClient.payments.unregisteredPayment(
  {
    'phoneNumber': '3206657470',
    'code': '1',
    'value': '5000'
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

[api-keys]: https://conecta.nequi.com.co/content/consultas?view=apiKey
