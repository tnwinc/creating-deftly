'use strict';
var Time = require('./Time'); //TODO Does this belong here??

var Assertions = function(branching) {
    var assertObj = {};

    var passing = 0;
    assertObj.getPassing = function() { return passing; };
    var failing = 0;
    assertObj.getFailing = function() { return failing; };

    var OPORATORS = {
        isA        : 'ia a: ',
        isNotA     : 'is NOT a: ',
        toBe       : 'to be: ',
        toEqual    : 'to equal: ',
        toNotBe    : 'to NOT be: ',
        toNotEqual : 'to NOT equal: ',
        hasLength  : 'to have a length of: ',
        hasProperty: 'to have the property: '
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

    assertObj.isA = function(actual, expected, message) {
        var pass = (Object.prototype.toString.call(actual) === '[object ' + expected + ']');
        return result(pass, expected, OPORATORS.isA, actual, message);
    };
    assertObj.typeOf = assertObj.isA;
    assertObj.isNotA = function(actual, expected, message) {
        var pass = (Object.prototype.toString.call(actual) !== '[object ' + expected + ']');
        return result(pass, expected, OPORATORS.isNotA, actual, message);
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

    assertObj.toNotBe = function(actual, expected, message) {
        var pass = (actual !== expected);
        return result(pass, expected, OPORATORS.toNotBe, actual, message);
    };

    assertObj.length = function(actual, expected, message) {
        var pass = (actual.length === expected);
        return result(pass, expected, OPORATORS.hasLength, actual, message);
    };

    assertObj.property = function(actual, expected, message) {
        var pass = false;
        for (var key in actual) {
            if (key === expected) pass = true;
        }
        return result(pass, expected, OPORATORS.hasProperty, actual, message);
    };


    assertObj.expect = function(test) {
        return {
            is: {
                a  : function(expected) { return assertObj.isA(test, expected); },
                not: {
                    a: function(unexpected) { return assertObj.isNotA(test, unexpected); }
                }
            },
            to: {
                be   : function(expected) { return assertObj.toBe(test, expected); },
                equal: function(expected) { return assertObj.equal(test, expected); },
                not  : {
                    be   : function(unexpected) { return assertObj.toNotBe(test, unexpected); },
                    equal: function(unexpected) { return assertObj.notEqual(test, unexpected); }
                }
            },
            has: {
                length  : function(number) { return assertObj.length(test, number); },
                property: function(string) { return assertObj.property(test, string); }
            }
        };
    };

    return assertObj;
};

module.exports = Assertions;
