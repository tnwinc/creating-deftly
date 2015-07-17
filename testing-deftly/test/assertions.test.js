'use strict';
/*global describe it xit*/
var expect = require('chai').expect;
var _expect = require('../lib/Assertions')( {its: [{tests: []}]} ).expect;

describe('expect', function() {
    describe('asserting 1 to be true', function() {
        xit('should yeild false', function() {
            var test1 = _expect(1).to.be(true);
            var test2 = _expect(1).to.be.true;
            expect(test1.passed).to.be.true;
            expect(test2.passed).to.be.true;
        });
    });


    describe('asserting "1" to be "1"', function() {
        xit(' should yeild true', function() {

        });
    });


    describe('asserting "1" to be a string', function() {
        xit(' should yeild true', function() {

        });
    });


    describe('asserting 1 to equal true', function() {
        var test = _expect(1).to.equal(true);
        it(' should yeild true', function() {
            expect(test.passed).to.be.true;
        });
    });

    describe('asserting 1 to NOT equal false', function() {
        var test = _expect(1).to.not.equal(false);
        it(' should yeild true', function() {
            expect(test.passed).to.be.true;
        });
    });


    describe('asserting [1] to have length (1)', function() {
        xit(' should yeild true', function() {

        });
    });


    describe('asserting {test:[1]} to have property("test") with length(1)', function() {
        xit(' should yeild true', function() {

        });
    });


});
