# Lancer

Es una pequeña librería basada en **jQuery** que encapsula funcionalidades inspiradas en frameworks como React o AngularJS con el objetivo de facilitar actividades comunes en el desarrollo de interfaces.

## ¿Qué hace?

La base de esta librería son los **reactores**: Objetos encapsulan las siguientes funcionalidades.

#### 1) Comunicación mediante eventos personalizados

Los reactores se comunican entre sí **suscribiéndose a eventos**. A diferencia de los eventos del DOM estos se definen con un nombre y pueden acompañarse por cualquier argumento. Los eventos pueden gatillarse desde cualquier lugar del código a través de un método provisto por la librería.

#### 2) Soporte de plantillas y actualización inteligente

Los reactores pueden iniciarse con una **plantilla** que se traducirá en una **variable jQuery** que se actualizará automáticamente ante cualquier cambio en las propiedades del reactor.

#### 3) Manejo simplificado elementos del DOM

Los reactores tienen una representación en el Dom que puede manipularse como variable jQuery o DOM Element. Esta representación puede ser eliminada, recreada o actualizada a través del reactor.

## Instalación

Descarga la última versión de **Lancer**, recuerda que se basa en **jQuery** por lo que se necesita incluir esta librería primero para su funcionamiento. Es compatible con las versiones 1.11.* o superior de jQuery. 

```html
<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
<script src="lance.js"></script>
```

## Hola Mundo

En construcción...

## Demo

Puedes encontrar una demo de la librería [Aquí](https://plnkr.co/edit/31uT8iPIX3cLwxKv7o71)

## Licencia

Copyright (C) 2017 Javier Cáceres Miño

Este programa es software libre: puede redistribuirlo y/o modificarlo bajo los términos de la Licencia General Pública de GNU publicada por la Free Software Foundation, ya sea la versión 3 de la Licencia, o (a su elección) cualquier versión posterior.

Este programa se distribuye con la esperanza de que sea útil pero SIN NINGUNA GARANTÍA; incluso sin la garantía implícita de MERCANTIBILIDAD o CALIFICADA PARA UN PROPÓSITO EN PARTICULAR. Vea la Licencia General Pública de GNU para más detalles en 

<http://www.gnu.org/licenses/>