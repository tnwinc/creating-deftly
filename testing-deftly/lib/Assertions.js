'use strict';
var Time = require('./Time'); //TODO Does this belong here??

var Assertions = function(branching) {
    var assertObj = {};

    var passing = 0;
    assertObj.getPassing = function() { return passing; };
    var failing = 0;
    assertObj.getFailing = function() { return failing; };

    var OPORATORS = {
        toBe      : 'to be       : ',
        toBeA     : 'to be a     : ',
        toEqual   : 'to equal    : ',
        toNotBe   : 'to NOT be   : ',
        toNotBeA  : 'to NOT be a : ',
        toNotEqual: 'to NOT equal: '
    };

    var result = function(_passed, _expected, _oporator, _got, _message) {
        if (_passed) passing++;
        else failing++;

        var resultObj = {
            passed  : _passed,
            expected: _expected,
            operator: _oporator,
            got     : _got,
            time    : new Time(), //TODO Does this belong here??
            message : _message
        };

        var index = branching.its.length - 1;
        branching.its[index].tests.push(resultObj);
        return resultObj;
    };

    assertObj.equal = function(actual, expected, message) {
        var pass = (actual == expected); // eslint-disable-line eqeqeq
        return result(pass, expected, OPORATORS.toEqual, actual, message);
    };

    assertObj.notEqual = function(actual, expected, message) {
        var pass = (actual != expected); // eslint-disable-line eqeqeq
        return result(pass, expected, OPORATORS.toNotEqual, actual, message);
    };

    assertObj.toBe = function(actual, expected, message) {
        var pass = (actual === expected);
        return result(pass, expected, OPORATORS.toBe, actual, message);
    };
    assertObj.areSame = assertObj.toBe;

    assertObj.toBeA = function(actual, expected, message) {
        var pass = (Object.prototype.toString.call(actual) === '[object ' + expected + ']');
        return result(pass, expected, OPORATORS.toBeA, actual, message);
    };
    assertObj.typeOf = assertObj.toBeA;

    assertObj.toNotBe = function(actual, expected, message) {
        var pass = (actual !== expected);
        return result(pass, expected, OPORATORS.toNotBe, actual, message);
    };

    assertObj.toNotBeA = function(actual, expected, message) {
        var pass = (Object.prototype.toString.call(actual) !== '[object ' + expected + ']');
        return result(pass, expected, OPORATORS.toNotBeA, actual, message);
    };


    assertObj.expect = function(test) {
        return {
            to: {
                be   : function(expected) { return assertObj.toBe(test, expected); },
                beA  : function(expected) { return assertObj.toBeA(test, expected); },
                equal: function(expected) { return assertObj.equal(test, expected); },
                not  : {
                    be   : function(unexpected) { return assertObj.toNotBe(test, unexpected); },
                    beA  : function(unexpected) { return assertObj.toNotBeA(test, unexpected); },
                    equal: function(unexpected) { return assertObj.notEqual(test, unexpected); }
                }
            }
        };
    };

    return assertObj;
};

module.exports = Assertions;
