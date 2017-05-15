var lance = (function () {

    var eBus = (function () {
        var _events = {};

        function addEvent(event) {
            _events[event] = [];
        }

        function broadcast(event, args) {
            !_events[event] && addEvent(event);
            _events[event].forEach(function (subscriber) {
                subscriber.catch(event, args);
            });
        }

        function subscribe(event, subscriber) {
            !_events[event] && addEvent(event);
            _events[event].push(subscriber);
        }

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

    function Reactor(tmpl, props) {
        return (function (t, p) {
            return function () {
                var _tmpl = t || null, _$elem = null, _that = this, _ebus = eBus, _handlers = {};

                function evaluation(_tmpl, data) {
                    var elem = _tmpl;
                    for (var prop in data) elem = String(elem).replace('{' + prop + '}', data[prop]);
                    return elem;
                }

                function conciliator(elem, base) {
                    for (var styleName in elem.styles) elem.styles[styleName] = base.styles[styleName]; //Experimental <!>
                    if (elem.nodeType == '3') elem.textContent = base.textContent;
                    else for (var i = 0, eAttribute, bAttribute; (eAttribute = elem.attributes[i]) && (bAttribute = base.attributes[i]); i++)
                        for (var prop in eAttribute)
                            if (typeof eAttribute[prop] == 'string' && eAttribute[prop] != bAttribute[prop]) eAttribute[prop] = bAttribute[prop];
                    for (var j = 0, child; child = elem.childNodes[j]; j++) conciliator(child, base.childNodes[j]);
                }

                function render(data) {
                    var $elem = $(evaluation(_tmpl, data));
                    _$elem ? conciliator(_$elem[0], $elem[0]) : (_$elem = $elem);
                    return _$elem;
                }

                function remove() {
                    _$elem.remove();
                    _$elem = null;
                }

                function getHtml() {
                    return _$elem[0];
                }

                function get$() {
                    return _$elem;
                }

                function set(props) {
                    for (var key in props) _that.props[key] = props[key];
                    _$elem && this.render(_that.props);
                }

                this.catch = function (event, args) {
                    _handlers[event].forEach(function (handler) {
                        handler.apply(this, args);
                    });
                };

                this.listen = function (event, handler) {
                    _eBus.subscribe(event, this);
                    !_handlers[event] && (_handlers[event] = []);
                    _handlers[event].push(handler);
                };

                // Init
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

            }
        })(tmpl, props);
    }

    var fire = function (event) {
        var _bus = eBus;
        _bus.broadcast(event);
    };

    return {
        r: function (t, p) {
            return new (Reactor(t, p))();
        },
        fire: fire
    };
})();
