'use strict';
/*global describe it*/
var expect = require('chai').expect;
var mocFile = require('./File.moc');
var Log = require('../lib/log');
var mocLogger = new Log('./fodder', 'mocAdobe.test', 4, 'Unix', mocFile);
var Branching = require('../lib/Branching')('testPath', mocLogger);

// var _describe = Branching.describe;
// var _xdescribe = Branching.xdescribe;
// var _it = Branching.it;
// var _xit = Branching.xit;

describe('branching', function() {
    describe('describe', function() {
        it('should push and pop itself from the describes array', function() {
            expect(Branching.describes.length).to.equal(0);
        });
    });

    describe('xdescribe', function() {

    });

    describe('it', function() {

    });

    describe('xit', function() {

    });
});
