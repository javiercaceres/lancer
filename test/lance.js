var assert = require('chai').assert,
    jQuery = require('jquery'),
    jsdom = require('jsdom').jsdom,
    lance = require('../dist/lance.js');

global.document = jsdom('');
global.window = document.defaultView;
global.$ = jQuery(window);

describe('Reactor', function() {
    describe('get$', function() {
        it('Debe retornar un objecto jQuery', function() {
            var helloWorld = lance.r( '<div>{text}</div>', { text: 'Hello world!' } );  
            assert.equal(helloWorld.get$().constructor.name == 'jQuery', 1);
        });
    });
});