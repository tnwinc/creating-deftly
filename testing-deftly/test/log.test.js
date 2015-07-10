'use strict';
/*global describe before it*/
var expect = require('chai').expect;
var log = require('../lib/log');

describe('log', function() {
    before(function() {
        var testLogger = log('./fodder/', 'testLogger.txt');
    });

    it('should create a loggerObject');

    it('should create testLogger.txt');

    it('should append if the file already exists');
});
