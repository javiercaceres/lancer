var expect = require('chai').expect,
    jQuery = require('jquery'),
    jsdom = require('jsdom').jsdom,
    lance = require('../dist/lance.js');

global.document = jsdom('');
global.window = document.defaultView;
global.$ = jQuery(window);

describe('Reactor - DOM representation', function () {
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