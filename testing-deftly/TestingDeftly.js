//#target illustrator
'use strict';

module.exports = function(params) {

    var TestingDeftly = function(params) {

        /// ************************************************************************
        /// Constructor Safe Check
        /// ************************************************************************
        if ( !( this instanceof TestingDeftly ) ) {
            return new TestingDeftly(params);
        }

        if ( !(params.Folder) || !(params.File) ) {
            throw 'Folder and File instances are required to initialize an instance of TestingDeftly.';
        }

        /// ************************************************************************
        /// Public Properties
        /// ************************************************************************
        this.testFileExtension = 'spec';
        this.projectDirectory = '~/Desktop';
        this.verboseOutput = false;
        this.enableWatch = false;
        this.testFiles = null;

        /// ************************************************************************
        /// Private Properties
        /// ************************************************************************
        var _options = params.Options || {};
        var _file = params.File; // eslint-disable-line no-undef
        var _folder = params.Folder; // eslint-disable-line no-undef
        var _evalFile = require('./lib/require');
        // var Log = require('./lib/log')(workingDirectory, '/testLogger.txt/', 2, 'Unix');

        /// ************************************************************************
        /// Private Methods
        /// ************************************************************************
        var runTests = function () {
            var tests = this.testFiles;

            for (var t in tests) {
               _evalFile(tests[t]);
            }

            return;
        }.bind(this);

        /// ************************************************************************
        /// Privileged Methods
        /// ************************************************************************
        this.reset = function(ops) {
            ops = ops || _options;
            this.testFileExtension = ops.testFileExtension || 'spec';
            this.projectDirectory = ops.projectDirectory || '~/Desktop';
            this.verboseOutput = ops.verboseOutput || false;
            this.enableWatch = ops.enableWatch || false;
            this.testFiles = _folder(this.projectDirectory).getFiles('*.' + this.testFileExtension);
        };

        this.run = function(ops) {
            this.reset(ops);
            runTests();
        };
    };

    return new TestingDeftly(params);

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

