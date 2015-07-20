'use strict';
/*global describe it*/
var expect = require('chai').expect;
var branchingMoc = {its: [{tests: []}]};
var _expect = require('../lib/Assertions')(branchingMoc).expect;

describe('Assertions', function() {
    describe('expect', function() {
        it('to be', function() {
            var test1 = _expect(1).to.be(true);
            var test2 = _expect('0').to.be('0');
            expect(test1.passed).to.be.false;
            expect(test2.passed).to.be.true;
        });

        it('to be a', function() {
            var test1 = _expect(5).to.beA('Number');
            var test2 = _expect('5').to.beA('String');
            var test3 = _expect([5]).to.beA('Array');
            var test4 = _expect({five: 5}).to.beA('Object');
            expect(test1.passed).to.be.true;
            expect(test2.passed).to.be.true;
            expect(test3.passed).to.be.true;
            expect(test4.passed).to.be.true;
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

        it('to not be a', function() {
            var test1 = _expect(5).to.not.beA('Number');
            var test2 = _expect('5').to.not.beA('String');
            var test3 = _expect([5]).to.not.beA('Array');
            var test4 = _expect({five: 5}).to.not.beA('Object');
            expect(test1.passed).to.be.false;
            expect(test2.passed).to.be.false;
            expect(test3.passed).to.be.false;
            expect(test4.passed).to.be.false;
        });

        it('to not equal', function() {
            var test1 = _expect('1').to.not.equal(1);
            var test2 = _expect(0).to.not.equal(false);
            expect(test1.passed).to.be.false;
            expect(test2.passed).to.be.false;
        });
    });
});
