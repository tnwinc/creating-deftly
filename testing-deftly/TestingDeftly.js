//#target illustrator
'use strict';

module.exports = function(options, mockFile, mockFolder) {

    var TestingDeftly = function(options, mockFile, mockFolder) {
        if ( options ) this.options = options;
        if ( mockFile ) this._file = mockFile; // eslint-disable-line no-undef
        if ( mockFolder ) this._folder = mockFolder;  // eslint-disable-line no-undef

        var _options = {};
        var _file = File;
        var _folder = Folder;
        var _evalFile = require('./lib/require');
        // var Log = require('./lib/log')(workingDirectory, '/testLogger.txt/', 2, 'Unix');

        var runTests = function() {
            var tests = this.testFiles;
            for (var t in tests) {
               this._evalFile(tests[t]);
            }
            return;
        };
    };

    TestingDeftly.prototype = {
        testFileExtension: 'spec',
        projectDirectory: '~/Desktop',
        verboseOutput: false,
        enableWatch: false,
        testFiles: this._folder(this.projectDirectory).getFiles('*.' + this.testFileExtension),

        reset: function(ops) {
            ops = ops || this._options;
            this.testFileExtension = ops.testFileExtension || 'spec';
            this.projectDirectory = ops.projectDirectory || '~/Desktop';
            this.verboseOutput = ops.verboseOutput || false;
            this.enableWatch = ops.enableWatch || false;
            this.testFiles = this._folder(this.projectDirectory).getFiles('*.' + this.testFileExtension);
        },

        run: function(ops) {
            this.reset(ops);
            this.runTests();
        }
    };

    return new TestingDeftly(options, mockFile, mockFolder);

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

