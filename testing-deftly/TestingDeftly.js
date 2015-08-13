//#target illustrator
'use strict';

var evalFile = require('./lib/require');

var TestingDeftly = function(options, _File, _Folder){
    options = options || {};
    try {
        _File = File || _File; // eslint-disable-line no-undef
        _Folder = Folder || _Folder; // eslint-disable-line no-undef
    } catch(e) {
        //do nothing
    }

    var testingObj = {};

    var reset = function(ops) {
        ops = ops || options;
        testingObj.testFileExtension = ops.testFileExtension || 'spec';
        testingObj.projectDirectory = ops.projectDirectory || '~/Desktop';
        testingObj.verboseOutput = ops.verboseOutput || false;
        testingObj.enableWatch = ops.enableWatch || false;
        testingObj.testFiles = _Folder(testingObj.projectDirectory).getFiles('*.' + testingObj.testFileExtension);
    };
    reset();
    testingObj.reset = reset;

    var runTests = function() {
        var tests = testingObj.testFiles;
        for (var t in tests) {
           evalFile(tests[t]);
        }
        return;
    };

    testingObj.run = function(ops) {
        reset(ops);
        runTests();
    };


    return testingObj;
};
/*
var os = Folder.fs //Windows, Macintosh, or Unix. (Use $.os for a more verbose description with version nuumbers)
var workingDirectory = File($.fileName).parent; //Make a file module an alias this to pwd
var describes = [];
var its = [];
var tabSize = 4;
var passing = 0;
var pending = 0;
var failing = 0;
var startTime;
var VERBOSE = false;
var MONITOR_CTRL = false;
var OFF = false;
var ON = true;

var reset = function() {
    describes = [];
    its = [];
    passing = 0;
    pending = 0;
    failing = 0;
    WATCH = false;
    MONITOR_CTRL = false;
    VERBOSE = false;
    watchList = [];
    updateBreaker();
}

var runTest = function(test) {
    WATCH = false;
    evalFile(test);
    if (WATCH && MONITOR_CTRL) {
        addToWatchList(test);
        if (VERBOSE) trace('WATCHing: ' + test.name);
    } else {
        removeFromwatchList(test);
    }
    updateBreaker();
    return;
};

var run = function() {
    clearTestLogs();
    reset();
    startTime = time();
    trace('Running Illustrator Tests: ' + date() + spaces(1) + startTime.standard + '\n');

    tests = workingDirectory.getFiles("*.aispec");
    for (var t in tests) {runTest(tests[t])}

    var finalTime = time();
    trace('finished running tests ' + finalTime.diff(startTime));
    printResults();
    trace('MONITOR_CTRL is ' + (MONITOR_CTRL ? '[ON] WATCHing for changes...' : '[OFF] Quiting'));
    if (!breaker.value) app.quit();
    else {
        if (VERBOSE) {
            var names = [];
            for (var i in watchList) names.push(watchList[i].name);
            trace('WATCHing:\n    ' + names.join('\n    ') + '\n[Set MONITOR_CTRL = OFF to stop]');
            monitor(watchList);
        } else {
            trace('WATCHing ' + watchList.length + ' files\n[Set MONITOR_CTRL = OFF to stop]');
            monitor(watchList);
        }
    }
};

var printResults = function() {
    writeToTestLogs(spaces(tabSize) + passing + ' passing');
    if (pending) writeToTestLogs(spaces(tabSize) + pending + ' pending');
    if (failing) writeToTestLogs(spaces(tabSize) + failing + ' failing');
}

run();
*/
module.exports = TestingDeftly;
