'use strict';
var Time = require('./Time');

var Branching = function(path, logger) {
    var writeToTestLogs = logger.writeln;
    var spaces = logger.tab;
    var tabSize = logger.tabSize;

    var branchingObj = {};
    branchingObj.its = [];
    branchingObj.describes = [];
    branchingObj.pending = 0;

    var xdescribe = function(description) {
        writeToTestLogs('xDescribe ' + description + ' ~~');
        writeToTestLogs('\n');
    };
    branchingObj.xdescribe = xdescribe;

    var describe = function(description, cb) {
        writeToTestLogs('Describe ' + description + ' --');
        branchingObj.describes.push(description);
        var describeStartTime = new Time();
        cb();
        var describeFinalTime = new Time();
        branchingObj.describes.pop();
        writeToTestLogs('-- ' + describeFinalTime.diff(describeStartTime) + '\n');
    };
    branchingObj.describe = describe;

    var xit = function(description) {
        branchingObj.pending++;
        writeToTestLogs('xIt ' + description + ' ~~');
    };
    branchingObj.xit = xit;

    var it = function(description, cb) {
        branchingObj.its.push({
            description: description,
            tests      : []
        });
        var itStartTime = new Time();
        cb();
        var itFinalTime = new Time();
        var index = branchingObj.its.length - 1;
        var results = branchingObj.its[index].tests;
        var passing = '✔ It ';
        var tests = [];

        for (var i = 0; i < results.length; i++) {
            if (results[i].passed) {
                tests.push(spaces(tabSize) + (i + 1) + ' ✔ ' + results[i].time.diff(itStartTime));
            } else {
                passing = '✘ It ';
                tests.push(spaces(tabSize) + (i + 1) + ' ✘ ' + results[i].time.diff(itStartTime));
                tests.push(spaces(tabSize * 2) + 'Expected    : [ ' + results[i].got + ' ]');
                tests.push(spaces(tabSize * 2) + results[i].operator + '[ ' + results[i].expected + ' ]');
            }
        }

        if (!results.length) passing = '~No Assertions Made for: It ';
        writeToTestLogs(passing + description + ': ' + itFinalTime.diff(itStartTime));
        if (passing === '✘ It ' || results.length > 1) {
            for (i = 0; i < tests.length; i++) {
                writeToTestLogs(tests[i]);
            }
        }
        branchingObj.its.pop();
    };
    branchingObj.it = it;

    return branchingObj;
};

module.exports = Branching;
