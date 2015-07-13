'use strict';
/*global describe it*/
var chai = require('chai');
chai.should();
var expect = chai.expect;
var time = require('../lib/Time');

describe('time', function() {
    var test = time();

    describe('time() object', function() {
        it('should have the following properties', function() {
            test.should.have.property('hour');
            test.should.have.property('minute');
            test.should.have.property('second');
            test.should.have.property('millisecond');
            test.should.have.property('standard');
            test.should.have.property('full');
            test.should.have.property('inMilliseconds');
            test.should.have.property('diff');
        });
    });

    describe('time.standard', function() {
        var standard = test.standard;
        it('should only include hour:minute:second', function() {
            // console.log('      ' + standard);
            expect(standard.match(/[:]/g)).to.have.length(2);
        });
    });

    describe('time.full', function() {
        var full = test.full;
        it('should include hour:minute:second:millisecond', function() {
            // console.log('      ' + full);
            expect(full.match(/[:]/g)).to.have.length(3);
        });
    });

    describe('diff', function() {

        describe('when comparing an increase in time', function() {
            var oldTime = {inMilliseconds: 52005000};
            var newTime = 63006010;
            var diff = time().diff(oldTime, newTime);
            it('should return a diff string', function() {
                expect(diff).to.equal('(+3h3min21s10m)');
            });
        });

        describe('when comparing a decrease in time', function() {
            var newTime = {inMilliseconds: 63006010};
            var oldTime = 52005000;
            var diff = time().diff(newTime, oldTime);
            it('should return a negative error time string', function() {
                expect(diff).to.equal('(-time, reverse your evaluation)');
            });
        });

        describe('when comparing equal times', function() {
            var oldTime = {inMilliseconds: 52005000};
            var newTime = 52005000;
            var diff = time().diff(oldTime, newTime);
            it('should return a simple diff string', function() {
                expect(diff).to.equal('(+0m)');
            });
        });
    });
});
