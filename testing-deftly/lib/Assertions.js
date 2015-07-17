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

    var Result = function(_passed, _expected, _oporator, _got, _message) {
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
        var pass = false;
        if (actual == expected) pass = true; // eslint-disable-line eqeqeq
        return new Result(pass, expected, OPORATORS.toEqual, actual, message);
    };

    assertObj.notEqual = function(actual, expected, message) {
        var pass = false;
        if (actual != expected) pass = true; // eslint-disable-line eqeqeq
        return new Result(pass, expected, OPORATORS.toNotEqual, actual, message);
    };


    assertObj.expect = function(test) {
        return {
            to: {
                be: function(expected) {
                    return assertObj.equal(test === expected, 'to be       : ', expected);
                },
                equal: function(expected) {
                    return assertObj.equal(test, expected);
                },
                not: {
                    be: function(unexpected) {
                            return assertObj.equal(test !== unexpected, 'to NOT be   : ', unexpected);
                    },
                    equal: function(unexpected) {
                            return assertObj.notEqual(test, unexpected);
                    }
                }
            }
        };
    };

    return assertObj;
};

module.exports = Assertions;
