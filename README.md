# Lancer

[![Version](https://img.shields.io/npm/v/lancer-js.svg)](https://www.npmjs.com/package/lancer-js)
[![Build Status](https://travis-ci.org/javiercaceres/lancer.svg?branch=develop)](https://travis-ci.org/javiercaceres/lancer)
[![Coverage Status](https://coveralls.io/repos/github/javiercaceres/lancer/badge.svg?branch=develop)](https://coveralls.io/github/javiercaceres/lancer?branch=develop)

Es una pequeña librería basada en **jQuery** que encapsula funcionalidades inspiradas en frameworks como React o AngularJS con el objetivo de facilitar actividades comunes en el desarrollo de interfaces.

## ¿Qué hace?

La base de esta librería son los **reactores**: Objetos encapsulan las siguientes funcionalidades.

#### 1) Comunicación mediante eventos personalizados

Los reactores se comunican entre sí **suscribiéndose a eventos**. A diferencia de los eventos del DOM estos se definen con un nombre y pueden acompañarse por cualquier argumento. Los eventos pueden gatillarse desde cualquier lugar del código a través de un método provisto por la librería.

#### 2) Soporte de plantillas y actualización inteligente

Los reactores pueden iniciarse con una **plantilla** que se traducirá en una **variable jQuery** que se actualizará automáticamente ante cualquier cambio en las propiedades del reactor.

#### 3) Manejo simplificado elementos del DOM

Los reactores tienen una representación en el Dom que puede manipularse como variable jQuery o DOM Element. Esta representación puede ser eliminada, recreada o actualizada a través del reactor.

#### 4) Componentes

Es posible crear una clase asociándole una plantilla, propiedades y handlers que serán usados por defecto en los reactores instanciados a partir de ella.

#### 5) Flujo de datos unidireccional

A través de un sincronizador que actúa como almacén de datos para un grupo de reactores los cambios fluyen desde sus propiedades a las de los reactores actualizándolas junto a su representación en el DOM.

## Instalación

Descarga la [última versión](https://github.com/javiercaceres/lancer/releases/latest) de **Lancer**, recuerda que se basa en **jQuery** por lo que se necesita incluir esta librería primero para su funcionamiento. Es compatible con las versiones 1.11.* o superior de jQuery.

```html
<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
<script src="lance.js"></script>
```

También puedes incluirla en tu proyecto **Node** utilizando npm.

```javascript
npm install lancer-js
```

Para que **jQuery** funcione en Node se requiere el objeto `window` con la propiedad `document`. Este objeto no existe nativamente en Node sin embargo puedes simularlo a través de herramientas como **jsdom**.

```javascript
require("jsdom").env("", function(err, window) {
    if (err) {
        console.error(err);
        return;
    }
 
    var $ = require("jquery")(window);
});
```

## Hola Mundo!

El primer paso será crear un nuevo reactor con una plantilla y un literal con propiedades.

```javascript
var helloWorld = lance.r( '<div>{text}</div>', { text: 'Hello world!' } );
```
El reactor ofrece una serie de métodos para manipular su representación en el DOM. El primero de ellos es `get$` que permite recuperar su representación como variable **jQuery** generada a partir de la plantilla y el literal.

```javascript
helloWorld.get$();

$('body').append(helloWorld.get$()); 
```

Como en el ejemplo anterior puede utilizarse para incluir la representación en el DOM.

```html
<body>
    <div>Hello world!</div>
</body>
```

## Documentación

### Reactor

#### r(tmpl, props, handlers) 

Instancia un nuevo reactor que opcionalmente puede recibir una plantilla para generar una representación en el DOM.
También puede inicializarse con un mapa de propiedades que se usarán para la construcción de la representación y una colección de handlers.  

##### Parámetros

| Nombre | Tipo | Descripción |
| ---- | ---- | ----------- |
| [tmpl] | `string`  | Plantilla para crear la representación en el DOM del reactor. |
| [props] | `Object`  | Mapa con la definición de propiedades. |
| [handlers] | `Object`  | Mapa con la colección de eventos y sus handlers. |

##### Ejemplo

```javascript
var Reactor = lance.r(
    '<div>{text}</div>', 
    { text: Hello World! }, 
    { 'userClick': [ 
        function() { 
            console.log('Hello!') 
        } 
    ] }
);
```
##### Retorna

- `function`  Constructor del Reactor.

#### Manipulación del DOM

Estos métodos solo estarán disponibles en el Reactor si se ha inicializado con una plantilla.

#### get$() 

Retorna el objeto jQuery del reactor.

##### Retorna

- `Object`  Objeto jQuery que representa al reactor.

#### getHtml() 

Retorna el Element Object asociado al objeto jQuery contenido
en el reactor.

##### Retorna

- `Object`  Element Object asociado al reactor.

#### render(props) 

A partir de un template y un grupo de propiedades (props) genera un objeto jQuery que representa el elemento descrito en la plantilla. 

##### Parámetros

| Nombre | Tipo | Descripción |
| ---- | ---- | ----------- |
| props | `Object`  | Mapa con las nuevas propiedades. |

##### Retorna

- `Object`  Objeto jQuery que representa al reactor actualizado.

#### set(props) 

Asigna nuevos valores a las props del reactor y luego redibuja su representación en el dom actualizando los valores del template con los nuevos datos.

##### Parámetros

| Name | Type | Description |
| ---- | ---- | ----------- |
| props | `Object`  | Objeto literal usado como mapa para asignar nuevas props. |

##### Ejemplos

```javascript
myReactor.set({propname: value});
```
##### Retorna

- `Object`  Propiedades actualizadas.

#### remove() 

Elimina la representación internamente y del DOM.

### Manipulación de eventos

#### listen(event, handler) 

Registra un handler a dispararse ante un evento en particular a través del método catch. También suscribre al reactor a ese evento en el bus.

##### Parámetros

| Nombre | Tipo | Descripción |
| ---- | ---- | ----------- |
| event | `string`  | Evento en el que se registrará el handler. |
| handler | `function`  | Función a ejecutarse ante el evento. |

#### forget(event) 

Método que elimina todos los handlers asociados a un evento y que
desinscribe al reactor de ese evento en el bus.

##### Parameters

| Nombre | Tipo | Descripción |
| ---- | ---- | ----------- |
| event | `string`  | Nombre bajo el que se registró el evento |

### Componentes

#### rClass(tmpl, props, handlers) 

Define al constructor para una nueva clase que a partir de una plantilla, propiedades y handlers instanciará a un nuevo Reactor que las usará como base permitiendo la creación de componentes. 

##### Parámetros

| Nombre | Tipo | Descripción |
| ---- | ---- | ----------- |
| [tmpl] | `string`  | Plantilla para crear la representación en el DOM del reactor. |
| [props] | `Object`  | Mapa con la definición de propiedades. |
| [handlers] | `Object`  | Mapa con la colección de eventos y sus handlers. |

##### Ejemplo

```javascript
var DivReactorClass = lance.rClass(
    '<div>{text}</div>', 
    { text: Hello World! }, 
    { 'userClick': [ 
        function() { 
            console.log('Hello!') 
        } 
    ] }
);

var divInstance = new DivReactorClass();
```

### Ejecución de eventos

#### fire(event, args) 

Comunica al bus un evento y los argumentos que podrían usar los handlers de los reactores.

##### Parámetros

| Nombre | Tipo | Descripción |
| ---- | ---- | ----------- |
| event | `string`  | Evento a transmitir a través del bus. |
| args | `array`  | Argumentos para los handlers. |

### Sincronizador

#### rs([props, reactors]) 

Genera un sincronizador encargado de ejecutar el método 'set' en cada uno de sus reactores cada vez que reciba una actualización sobre sus propiedades.

##### Parámetros

| Nombre | Tipo | Descripción |  |
| ---- | ---- | ----------- | -------- |
| props | `Object`  | Propiedades con las que se inicializa el sincronizador. | *Optional* |
| reactors | `array`  | Colección de reactores con que se inicia el sincronizador. | *Optional* |

##### Retorna

- `Object`  Sincronizador.

#### balance(props) 

Determina si debe actualizar o no los reactores. En tal caso ejecuta el método 'set' en cada uno de ellos.

##### Parámetros

| Nombre | Tipo | Descripción |
| ---- | ---- | ----------- |
| props | `Object`  | Literal con las nuevas propiedades. |

##### Retorna

- `Object` Propiedades actualizadas del sincronizador.

#### inc(reactor) 

Agrega un reactor al dominio del sincronizador. No se puede incluir dos 
veces al mismo reactor. Una vez incluido es inmediatamente sincronizado.

##### Parámetros

| Nombre | Tipo | Descripción |
| ---- | ---- | ----------- |
| reactor | `any`  | - Reactor a incluir. |

##### Retorna

- `Object` Sincronizador.

#### exc(reactor) 

Quita un reactor del dominio del sincronizador.

##### Parámetros

| Nombre | Tipo | Descripción |
| ---- | ---- | ----------- |
| reactor | `Object`  | Reactor a excluir. |

##### Retorna

- `Object` Sincronizador.

## Demo

Puedes encontrar una demo de la librería [Aquí](https://plnkr.co/edit/31uT8iPIX3cLwxKv7o71)

## Licencia

Copyright (C) 2017 Javier Cáceres M.

Este programa es software libre: puede redistribuirlo y/o modificarlo bajo los términos de la Licencia General Pública de GNU publicada por la Free Software Foundation, ya sea la versión 3 de la Licencia, o (a su elección) cualquier versión posterior.

Este programa se distribuye con la esperanza de que sea útil pero SIN NINGUNA GARANTÍA; incluso sin la garantía implícita de MERCANTIBILIDAD o CALIFICADA PARA UN PROPÓSITO EN PARTICULAR. Vea la Licencia General Pública de GNU para más detalles en 

<http://www.gnu.org/licenses/>

