'use strict';
/*global describe it xit*/

var expect = require('chai').expect;
var watcher = require('../lib/Watcher.js')();

describe('watch', function() {
    describe('when watch is turned on', function() {
        it('should add files to the watch list', function() {

        });

        it('should pole each file in the list every second', function() {

        });

        describe('when watch is turned off while watching', function() {
            it('should exit the loop and stop watching', function() {

            });
        });
    });

    describe('when watch is turned off', function() {
        it('should not add any files to the watch list', function() {

        });

        xit('should exit the code execution', function() {
            expect(watcher.watchList).to.have.length(0);
        });
    });
});
