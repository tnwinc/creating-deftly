'use strict';
/*global describe it before beforeEach*/
var expect = require('chai').expect;
var Time = require('../lib/Time');
var mocFile = require('./File.moc');
var Log = require('../lib/logger');
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
var _it = Branching.it;
var _xit = Branching.xit;

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
        var mocTestResult = function(passed) {
            return {
                passed  : passed,
                expected: 1,
                operator: 'to be       : ',
                got     : 1,
                time    : new Time()
            };
        };

        describe('it with no tests', function() {
            it('should push and pop itself from the describes array and pass', function() {
                expect(Branching.its.length).to.equal(0);

                _it('testIt', function() {
                    expect(logText).to.equal('');
                    expect(Branching.its.length).to.equal(1);
                });

                expect(Branching.its.length).to.equal(0);
                expect(logText).to.contains('~No Assertions Made for: It testIt: ');
            });
        });

        describe('it with a passing test', function() {
            it('should push and pop itself from the describes array and pass', function() {
                expect(Branching.its.length).to.equal(0);

                _it('testIt', function() {
                    expect(logText).to.equal('');
                    expect(Branching.its.length).to.equal(1);

                    Branching.its[0].tests.push(mocTestResult(true));
                });

                expect(Branching.its.length).to.equal(0);
                expect(logText).to.contains('✔ It testIt: ');
            });
        });

        describe('it with a failing test', function() {
            it('should push and pop itself from the describes array and pass', function() {
                expect(Branching.its.length).to.equal(0);

                _it('testIt', function() {
                    expect(logText).to.equal('');
                    expect(Branching.its.length).to.equal(1);

                    Branching.its[0].tests.push(mocTestResult(false));
                });

                expect(Branching.its.length).to.equal(0);
                expect(logText).to.contains('✘ It testIt: ');
            });
        });

        describe('it with several tests', function() {
            it('should push and pop itself from the describes array and pass', function() {
                expect(Branching.its.length).to.equal(0);

                _it('testIt', function() {
                    expect(logText).to.equal('');
                    expect(Branching.its.length).to.equal(1);

                    Branching.its[0].tests.push(mocTestResult(false));
                    Branching.its[0].tests.push(mocTestResult(true));
                    Branching.its[0].tests.push(mocTestResult(false));
                    Branching.its[0].tests.push(mocTestResult(true));
                });

                expect(Branching.its.length).to.equal(0);
                expect(logText).to.contains('✘ It testIt: ');
                expect(logText).to.contains('1 ✘');
                expect(logText).to.contains('2 ✔');
                expect(logText).to.contains('3 ✘');
                expect(logText).to.contains('4 ✔');
            });
        });
    });

    describe('xit', function() {
        before(function() {
            Branching.pending = 0;
        });

        it('should not push itself to the its array', function() {
            expect(Branching.its.length).to.equal(0);

            _xit('testxit', function() {});
            expect(Branching.its.length).to.equal(0);

            expect(Branching.its.length).to.equal(0);
            expect(logText).to.contains('xIt testxit ~~');

            expect(Branching.pending).to.equal(1);
        });
    });
});
