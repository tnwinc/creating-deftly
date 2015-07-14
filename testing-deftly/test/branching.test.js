'use strict';
/*global describe it beforeEach*/
var expect = require('chai').expect;
var mocFile = require('./File.moc');
var Log = require('../lib/log');
var logText = '';
var mocLogger = new Log('./fodder', 'mocAdobe.test', 4, 'Unix', mocFile);
mocLogger.writeln = function(string, tabCount, action) {
    if (string === undefined || string === null) throw ('log Object: writeLn: ERROR: Must provide a string value');
    tabCount = tabCount || 0;
    action = action || 'a'; //'w'
    var text = (mocLogger.tab(tabCount * mocLogger.tabSize) + string);
    if (action === 'a') logText += text;
    else logText = text;
    return mocLogger;
};
var Branching = require('../lib/Branching')('testPath', mocLogger);

var _describe = Branching.describe;
var _xdescribe = Branching.xdescribe;
// var _it = Branching.it;
// var _xit = Branching.xit;

describe('branching', function() {
    beforeEach(function() {
        logText = '';
    });

    describe('describe', function() {
        it('should push and pop itself from the describes array', function() {
            expect(Branching.describes.length).to.equal(0);

            _describe('testDescribe', function() {
                expect(logText).to.equal('Describe testDescribe --');
                expect(Branching.describes.length).to.equal(1);
            });

            expect(Branching.describes.length).to.equal(0);
            expect(logText).to.contains('Describe testDescribe ---- ');
        });
    });

    describe('xdescribe', function() {
        it('should not push itself to the describes array', function() {
            expect(Branching.describes.length).to.equal(0);

            _xdescribe('testxDescribe', function() {});
            expect(Branching.describes.length).to.equal(0);

            expect(Branching.describes.length).to.equal(0);
            expect(logText).to.contains('xDescribe testxDescribe ~~');
        });
    });

    describe('it', function() {

    });

    describe('xit', function() {

    });
});
