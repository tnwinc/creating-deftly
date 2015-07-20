'use strict';
/*global describe it*/
var expect = require('chai').expect;
var branchingMoc = {its: [{tests: []}]};
var _expect = require('../lib/Assertions')(branchingMoc).expect;

describe('Assertions', function() {
    describe('expect', function() {
        it('is a', function() {
            var test1 = _expect(5).is.a('Number');
            var test2 = _expect('5').is.a('String');
            var test3 = _expect([5]).is.a('Array');
            var test4 = _expect({five: 5}).is.a('Object');
            expect(test1.passed).to.be.true;
            expect(test2.passed).to.be.true;
            expect(test3.passed).to.be.true;
            expect(test4.passed).to.be.true;
        });

        it('is not a', function() {
            var test1 = _expect(5).is.not.a('Number');
            var test2 = _expect('5').is.not.a('String');
            var test3 = _expect([5]).is.not.a('Array');
            var test4 = _expect({five: 5}).is.not.a('Object');
            expect(test1.passed).to.be.false;
            expect(test2.passed).to.be.false;
            expect(test3.passed).to.be.false;
            expect(test4.passed).to.be.false;
        });

        it('to be', function() {
            var test1 = _expect(1).to.be(true);
            var test2 = _expect('0').to.be('0');
            expect(test1.passed).to.be.false;
            expect(test2.passed).to.be.true;
        });

        it('to equal', function() {
            var test1 = _expect('1').to.equal(1);
            var test2 = _expect(0).to.equal(false);
            expect(test1.passed).to.be.true;
            expect(test2.passed).to.be.true;
        });

        it('to not be', function() {
            var test1 = _expect(0).to.not.be(false);
            var test2 = _expect('0').to.not.be('0');
            expect(test1.passed).to.be.true;
            expect(test2.passed).to.be.false;
        });

        it('to not equal', function() {
            var test1 = _expect('1').to.not.equal(1);
            var test2 = _expect(0).to.not.equal(false);
            expect(test1.passed).to.be.false;
            expect(test2.passed).to.be.false;
        });

        it('has length', function() {
            var test1 = _expect([1, 2, 3]).has.length(3);
            expect(test1.passed).to.be.true;
        });

        it('has property', function() {
            var test1 = _expect({test: 5}).has.property('test');
            expect(test1.passed).to.be.true;
        });
    });
});
