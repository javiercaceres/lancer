/**
 * @fileoverview Contiene una pequeña librería basada en JQuery llamada Lancer que encapsula 
 * funcionalidades inspiradas en frameworks como React o AngularJS con el objetivo de facilitar 
 * actividades comunes en el desarrollo de interfaces.
 * @author Javier Cáceres <javier.caceres.mn@gmail.com>
 * @version 0.2.0
 */

/**
 * Lancer
 * @namespace
 */

/**
 * La base de esta Librería son los llamados reactores (r): Objetos que se inicializan con una
 * plantilla, un literal que usarán como propiedades y una colección de handlers asociados a eventos
 * personalizados. 
 * La plantilla es interpretada y transformada en un elemento del Dom a la que se asignan las 
 * propiedades iniciales, cuando cambian estas propiedades el elemento es actualizado automáticamente.
 * Los reactores se comunican entre si mediante suscripciones a eventos. Un evento puede ser
 * disparado llamando al método "fire".
 * La representación del reactor en el Dom puede ser manipulada como variable jQuery o elemento
 * del Dom, también puede ser eliminada, recreada o actualizada con nuevas propiedades.
 * Puedes definir un componente agrupando una plantilla, propiedades y handlers en un constructor
 * para generar nuevos Reactores.     
 * 
 * @returns {Object} - Expone el método para la creación de una nueva instancia de un reactor (r)
 *                     y la función para transmitir eventos a través del bus (fire.)
 */

var lance = (function () {
    /**
     * Bus encargado de difundir los eventos a los diferentes suscriptores.
     * 
     * @returns {Object} - Expone los métodos: addEvent, broadcast, subscribe y unsubscribe.
     */
    var eBus = (function () {
        var _events = {};

        /**
         * Registra un evento en el mapa del bus
         *
         * @param {string} event - Evento a registrarse. 
         */
        function addEvent(event) {
            _events[event] = [];
        }

        /**
         * Difunde el evento a través de los suscriptores entregando el arreglo
         * de argumentos que podrían utilizar los reactores.
         * 
         * @param {string} event - Evento a difundirse.
         * @param {array} args - Argumentos para los handlers.
         */
        function broadcast(event, args) {
            !_events[event] && addEvent(event);
            _events[event].forEach(function (subscriber) {
                subscriber.catch(event, args);
            });
        }

        /**
         * Suscribe un reactor a un evento específico.
         *  
         * @param {string} event - Evento al que se suscribirse.
         * @param {Object} subscriber - Reactor que será suscrito.
         */
        function subscribe(event, subscriber) {
            !_events[event] && addEvent(event);
            _events[event].push(subscriber);
        }

        /**
         * Quita a un reactor del arreglo de suscriptores de un evento.
         * 
         * @param {string} event - Evento del que se eliminará al suscriptor.
         * @param {Object} subscriber - Reactor suscrito al evento.
         */
        function unsubscribe(event, subscriber) {
            _events[event] && _events[event].splice(_events[event].indexOf(subscriber), 1);
        }

        return {
            addEvent: addEvent,
            broadcast: broadcast,
            subscribe: subscribe,
            unsubscribe: unsubscribe
        };
    })();

    /**
     * Define al constructor para una nueva clase que a partir de una plantilla, 
     * propiedades y handlers instanciará a un nuevo Reactor que las usará como base
     * permitiendo la creación de componentes. 
     * 
     * @param {string} tmpl - Plantilla para crear la representación en el DOM del reactor.
     * @param {Object} props - Mapa con la definición de propiedades.
     * @param {Object} handlers - Mapa con la colección de eventos y sus handlers.
     * @example
     * Reactor(
     *     '<div>{text}</div>', 
     *     { text: Hello World! }, 
     *     { 'userClick': [ 
     *         function() { 
     *             console.log('Hello!') 
     *         } 
     *     ] }
     * );
     * @returns {function} - Constructor del Reactor.
     */
    function Reactor(tmpl, props, handlers) {
        return (function (t, p, h) {
            return function () {
                var _tmpl = t || null, _$elem = null, _that = this, _ebus = eBus, _handlers = {};

                /**
                 * Reemplaza cada variable en el template con las props entregadas en el literal.
                 * 
                 * @param {string} _tmpl - Template del elemento del dom 
                 * @param {object} props - Objeto literal con las props que se aplicarán sobre el template.  
                 * @example
                 * //returs "<div>Hello world!<div>" 
                 * evaluation("<div>{text}<div>", {text: "Hello world!"});
                 * @returns {string} - Cadena de caracteres con las props en lugar de variables.
                 */
                function evaluation(_tmpl, props) {
                    var elem = _tmpl;
                    for (var prop in props) elem = String(elem).replace('{' + prop + '}', props[prop]);
                    return elem;
                }

                /**
                 * Compara un Objeto Elem con otro similar e iguala las propiedades en caso de que no coincidan, 
                 * ambos objetos deben generarse usando el mismo template y no debe variar el número de nodos 
                 * hijos. En caso de que se agreguen nuevas propiedades no definidas en el template podrían ser
                 * ignoraras por esta función.
                 * 
                 * @param {Object} elem - Objeto element a ser rectificado.
                 * @param {Object} base - Objeto element usado como guía para la conciliación.
                 */
                function conciliator(elem, base) {
                    for (var styleName in elem.styles) elem.styles[styleName] = base.styles[styleName]; //Experimental <!>
                    if (elem.nodeType == '3') elem.textContent = base.textContent;
                    else for (var i = 0, eAttribute, bAttribute; (eAttribute = elem.attributes[i]) && (bAttribute = base.attributes[i]); i++)
                        for (var prop in eAttribute)
                            if (typeof eAttribute[prop] == 'string' && eAttribute[prop] != bAttribute[prop]) eAttribute[prop] = bAttribute[prop];
                    for (var j = 0, child; child = elem.childNodes[j]; j++) conciliator(child, base.childNodes[j]);
                }

                /**
                 * A partir de un template y un grupo de propiedades (props) genera un objeto jQuery que
                 * representa el elemento descrito en la plantilla. 
                 * 
                 * @param {Object} - Mapa con las nuevas propiedades. 
                 * @returns {Object} - Objeto jQuery que representa al reactor actualizado.
                 */
                function render(props) {
                    var $elem = $(evaluation(_tmpl, props));
                    _$elem ? conciliator(_$elem[0], $elem[0]) : (_$elem = $elem);
                    return _$elem;
                }

                /**
                 * Elimina el elemento del dom y todos sus hijos. 
                 */
                function remove() {
                    _$elem.remove();
                    _$elem = null;
                }

                /**
                 * Retorna el objeto jQuery del reactor.
                 * 
                 * @returns {Object} - Objeto jQuery que representa al reactor. 
                 */
                function get$() {
                    return _$elem;
                }

                /**
                 * Retorna el Element Object asociado al objeto jQuery contenido
                 * en el reactor.
                 * 
                 * @returns {Object} - Element Object asociado al reactor. 
                 */
                function getHtml() {
                    return _$elem[0];
                }

                /**
                 * Asigna nuevos valores a las props del reactor y luego redibuja su representación
                 * en el dom actualizando los valores del template con los nuevos datos.
                 * 
                 * @param {Object} props - Objeto literal usado como mapa para asignar nuevas props.
                 * @example 
                 * myReactor.set({propname: value});
                 */
                function set(props) {
                    for (var key in props) _that.props[key] = props[key];
                    _$elem && this.render(_that.props);
                }

                /**
                 * Registra un handler a dispararse ante un evento en particular a través
                 * del método catch. También suscribre al reactor a ese evento en el bus.
                 * 
                 * @param {string} event - Evento en el que se registrará el handler.
                 * @param {function} handler - Función a ejecutarse ante el evento.  
                 */
                this.listen = function (event, handler) {
                    _eBus.subscribe(event, this);
                    !_handlers[event] && (_handlers[event] = []);
                    _handlers[event].push(handler);
                };

                /**
                 * Ejecuta los handlers del reactor asociados a un evento particular.
                 * 
                 * @param {string} event - Evento con handlers asociados.
                 * @param {array} args - Argumentos a entregarse a los handlers.
                 */
                this.catch = function (event, args) {
                    _handlers[event].forEach(function (handler) {
                        handler.apply(this, args);
                    });
                };

                /**
                 * Método que elimina todos los handlers asociados a un evento y que
                 * desinscribe al reactor de ese evento en el bus.
                 * 
                 * @param {string} event -  
                 */
                this.forget = function (event) {
                    delete this._handlers[event];
                    _eBus.unsubscribe(event, this);
                };

                // Inicialización
                // Si se asigna un template se exponen los métodos para la manipulación de la 
                // representación en el Dom. Si además se agregan propiedades se expone el
                // habilita el método set que actualiza automáticamente la vista cuando es 
                // ejecutado.                
                if (_tmpl) {
                    this.render = render;
                    this.get$ = get$;
                    this.getHtml = getHtml;
                    this.remove = remove;
                    if (props) {
                        this.props = $.extend(true, {}, props);
                        this.render(this.props);
                    }
                }
                // Se aplica el método listen por cada handler recibido como argumento del
                // constructor.
                if (h) for (var event in h)
                    h[event].forEach(function (handler) {
                        _that.listen(event, handler);
                    });
            }
        })(tmpl, props, handlers);
    }

    /**
     * Comunica al bus un evento y los argumentos que podrían usar los handlers
     * de los reactores.
     * 
     * @param {string} event - Evento a transmitir a través del bus. 
     * @param {array} args - Argumentos para los handlers.
     */
    var fire = function (event, args) {
        var _bus = eBus;
        _bus.broadcast(event, args);
    };

    return {
        rClass: Reactor,
        r: function (t, p, h) {
            return new (Reactor(t, p, h))();
        },
        fire: fire
    };
})();

if (typeof module === "object" && typeof module.exports === "object") module.exports = lance;
