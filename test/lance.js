var expect = require('chai').expect,
    jQuery = require('jquery'),
    jsdom = require('jsdom').jsdom,
    lance = require('../dist/lance.js');

global.document = jsdom('');
global.window = document.defaultView;
global.$ = jQuery(window);

describe('Reactor - DOM representation', function () {

    describe('Initialization without template', function () {
        it('should return a Reactor object without DOM manipulation methods', function () {
            var helloWorld = lance.r();

            expect(helloWorld).to.not.have.property('set');
            expect(helloWorld).to.not.have.property('get$');
            expect(helloWorld).to.not.have.property('getHtml');
            expect(helloWorld).to.not.have.property('remove');
            expect(helloWorld).to.not.have.property('render');
        });
    });

    describe('#get$()', function () {
        it('should return a jQuery object', function () {
            var helloWorld = lance.r('<div>{text}</div>', { text: 'Hello world!' });

            expect(helloWorld.get$().constructor.name).to.equal('jQuery');
        });
    });

    describe('#render()', function () {
        it('should return a updated jQuery object using a map', function () {
            var helloWorld = lance.r('<div>{text}</div>', { text: 'Hello world!' });
            var updated = helloWorld.render({ text: 'Bye bye!' });

            expect(updated.constructor.name).to.equal('jQuery');
            expect(updated.text()).to.equal('Bye bye!');
        });
    });

    describe('#remove()', function () {
        it('should remove the jQuery representation', function () {
            var helloWorld = lance.r('<div>{text}</div>', { text: 'Hello world!' });
            helloWorld.remove();

            expect(helloWorld.get$()).to.be.null;
        });
    });

    describe('#getHtml()', function () {
        it('should return a HTML DOM Element object', function () {
            var helloWorld = lance.r('<div>{text}</div>', { text: 'Hello world!' });

            expect(helloWorld.getHtml()).to.have.property('tagName');
        });
    });
});

describe('Reactor - Event Bus', function () {

    describe('#listen() && #fire()', function () {
        it('should listen a fired event', function () {
            var emitter = lance.r(), listened = false;
            emitter.listen('customEvent', function (value) {
                listened = value;
            });
            lance.fire('customEvent', [true]);

            expect(listened).to.be.true;
        });
    });

    describe('#forget()', function () {
        it("should forget the custom event", function () {
            var emitter = lance.r(), listened = false;
            emitter.listen('customEvent', function (value) {
                listened = value;
            });
            emitter.forget('customEvent');
            lance.fire('customEvent', [true]);

            expect(listened).to.be.false;
        });
    });
});

describe('Reactor - Setter', function () {

    describe('#set()', function () {
        it('should update props and representation', function () {
            var helloWorld = lance.r('<div>{text}</div>', { text: 'Hello world!' });
            helloWorld.set({ text: 'Bye bye!' });

            expect(helloWorld.props).to.have.property('text');
            expect(helloWorld.props.text).to.equal('Bye bye!');
            expect(helloWorld.get$().text()).to.equal('Bye bye!');
        });
    });
});

describe('Reactor Class', function () {

    var listened = false,
        DivReactor = lance.rClass(
            '<div>{text}</div>',
            {
                text: 'default'
            },
            {
                'customEvent': [
                    function (value) {
                        listened = value;
                    }
                ]
            }
        ),
        divInstance = new DivReactor();
    
    lance.fire('customEvent', [true]);

    describe('Initialization', function () {
        it('should return a constructor', function () {
            expect(divInstance).to.be.an.instanceof(DivReactor);
        });
    });

    describe('New instance', function () {
        it('should use default params', function () {
            expect(listened).to.be.true;
            expect(divInstance.get$().text()).to.equal('default');
            expect(divInstance.props).to.have.property('text');
            expect(divInstance.props.text).to.equal('default');
        });
    });
});