'use strict';
/*global describe before it*/

var expect = require('chai').expect;
var mocFile = require('./File.moc');
var Log = require('../lib/log');

describe('Log', function() {
    var testLogger = new Log('./fodder', '/testLogger.txt/', 2, 'Unix', mocFile);

    describe('the loggerObject', function() {
        it('should be created with these properties and values', function() {
            expect(testLogger).to.have.property('setPath');
            expect(testLogger.path).to.equal('./fodder/');
            expect(testLogger).to.have.property('setName');
            expect(testLogger.name).to.equal('testLogger.txt');
            expect(testLogger).to.have.property('setFile');
            expect(testLogger.file.name).to.equal('./fodder/testLogger.txt');
            expect(testLogger).to.have.property('setLineFeed');
            expect(testLogger.file.encoding).to.equal('UTF-8');
            expect(testLogger.file.lineFeed).to.equal('Unix');
            expect(testLogger).to.have.property('setTabSize');
            expect(testLogger.tabSize).to.equal(2);
            expect(testLogger.tab(5)).to.equal('     ');
            expect(testLogger).to.have.property('writeLn');
            expect(testLogger).to.have.property('trace');
            expect(testLogger).to.have.property('clear');
        });
    });

    describe('writeLn', function() {
        before(function() {
            testLogger.writeLn('this is a test log.', 2);
        });

        it('it should append', function() {
            testLogger.writeLn(' And this line should be appended');
            var expectedString = ('    this is a test log. And this line should be appended');
            expect(testLogger.file.text).to.equal(expectedString);
        });
    });

    describe('clear', function() {
        before(function() {
            testLogger.writeLn('this is a test log.', 2);
        });

        it('should reset the log', function() {
            testLogger.clear();
            expect(testLogger.file.text).to.equal('');
        });
    });

    describe('trace', function() {
        it('should append with the trace identifier', function() {
            expect(testLogger.trace('test').file.text).to.equal('testingDeftly-- test');
        });
    });
});
