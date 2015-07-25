'use strict';
/*global describe it*/
var expect = require('chai').expect;
var _require = require('../lib/require');

var testModule = function() {
    return 'module.exports = {test: true};';
};

var fileMoc = {
    open  : function() {},
    read  : function() { return testModule(); },
    close : function() {},
    exists: true
};


describe('require', function() {
    it('should return the module', function() {
        var test = _require(fileMoc);
        expect(test.test).to.be.true;
    });
});
