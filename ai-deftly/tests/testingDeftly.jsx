﻿#target illustrator

var os = Folder.fs //Windows, Macintosh, or Unix. (Use $.os for a more verbose description with version nuumbers)
var workingDirectory = File($.fileName).parent; //Make a file module an alias this to pwd
var time = function(date) {
    var time = date || new Date();
    var _hour        = time.getHours();
    var _minute      = time.getMinutes();
    var _second      = time.getSeconds();
    var _millisecond = time.getMilliseconds();
    var _inMilliseconds = Date.now();
    result = {
        hour          : _hour,
        minute        : _minute,
        second        : _second,
        millisecond   : _millisecond,
        standard      : ('('+_hour+':'+_minute+':'+_second+')'),
        full          : ('('+_hour+':'+_minute+':'+_second+':'+_millisecond+')'),
        inMilliseconds: _inMilliseconds,
        diff          : function(oldTime, newTime) {
            var newTime = newTime || _inMilliseconds;
            var timeDiff = newTime - oldTime.inMilliseconds;

            var hours   = (1000*60*60);
            var minutes = (1000*60);
            var seconds = (1000);

            var format = function(value, part) {
                if (part == 'm' && value == 000) return '0m';
                if (value > 0) return (value+part);
                else return '';
            }

            var hoursDiff        = format(Math.floor(timeDiff/hours), 'h');
            var modHours         = timeDiff%hours;
            var minutesDiff      = format(Math.floor(modHours/minutes), 'min');
            var modMinutes       = modHours%minutes;
            var secondsDiff      = format(Math.floor(modMinutes/seconds), 's');
            var millisecondsDiff = format(modMinutes%seconds, 'm');

            return "(+"+hoursDiff+minutesDiff+secondsDiff+millisecondsDiff+")";
        }
    };
    return result;
}

var date = function() {
    var date = new Date();
    return ((date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear());
};
var spaces = function(number) {
    var spaces = '';
    while(number > 0) {
        spaces += ' ';
        number --;
    }
    return spaces;
};
var tabSize = 4;

var testLogsPath = workingDirectory + '/adobe.test';
var testLogs = File(testLogsPath);
if (!testLogs.exists) testLogs = new File(testLogsPath);

testLogs.encoding = "UTF-8";
testLogs.lineFeed = "Unix";
// txtFile.lineFeed = "Windows";
// txtFile.lineFeed = "Macintosh";
var clearTestLogs = function() {
    testLogs.open('w');
    testLogs.writeln('');
    testLogs.close();
};

var describes = [];
var its = [];
var passing = 0;
var pending = 0;
var failing = 0;
var writeToTestLogs = function(string) {
    testLogs.open('a');
    testLogs.writeln(spaces(describes.length * tabSize) + string);
    testLogs.close();
};
var VERBOSE = false;
var trace = function(string) {
    writeToTestLogs('testingDeftly-- ' + string);
};
var printResults = function() {
    writeToTestLogs(spaces(tabSize) + passing + ' passing');
    if (pending) writeToTestLogs(spaces(tabSize) + pending + ' pending');
    if (failing) writeToTestLogs(spaces(tabSize) + failing + ' failing');
}

var startTime;
var xdescribe = function(description, cb) {
    writeToTestLogs('xDescribe ' + description + ' ~~');
    writeToTestLogs('\n');
};
var describe = function(description, cb) {
    writeToTestLogs('Describe ' + description + ' --');
    describes.push(description);
    var describeStartTime = time();
    cb();
    var describeFinalTime = time();
    describes.pop();
    writeToTestLogs('-- ' + describeFinalTime.diff(describeStartTime) + '\n');
};

var xit = function(description, cb) {
    pending++
    writeToTestLogs('xIt ' + description + ' ~~');
};
var it = function(description, cb) {
    its.push({
        description: description,
        tests      : []
    });
    var itStartTime = time();
    cb();
    var itFinalTime = time();
    var index = its.length-1;
    var results = its[index].tests;
    var passing = '✔ It ';
    var tests = [];

    for (i=0; i<results.length; i++) {
        if (results[i].passed) {
            tests.push(spaces(tabSize) + (i+1) + ' ✔ ' + results[i].time.diff(itStartTime));
        } else {
            passing = '✘ It ';
            tests.push(spaces(tabSize) + (i+1) + ' ✘ ' + results[i].time.diff(itStartTime));
            tests.push(spaces(tabSize*2) + 'Expected    : [ ' + results[i].got + ' ]');
            tests.push(spaces(tabSize*2) + results[i].operator + '[ ' +  results[i].expected + ' ]');
        }
    }
    
    writeToTestLogs(passing + description + ': ' + itFinalTime.diff(itStartTime));
    if (passing == '✘ It ' || results.length > 1) {
        for (i=0; i<tests.length; i++) {
            writeToTestLogs(tests[i]);
        }
    }
    its.pop();
};

var expect = function(test) {
    var logResult = function(result, operator, got) {
        var index = its.length-1;
        if (result) {
            passing++;
        } else {
            failing++;
        }
        its[index].tests.push({
            passed  : result,
            expected: test,
            operator: operator,
            got     : got,
            time    : time()
        });
    };

    return {
        to: {
            be: function(expected) {
                return logResult(test === expected, 'to be       : ', expected);
            },
            equal: function(expected) {
                return logResult(test == expected, 'to equal    : ', expected);
            },
            not: {
                be: function(unexpected) {
                        return logResult(test !== unexpected, 'to NOT be   : ', unexpected);
                },
                equal: function(unexpected) {
                        return logResult(test != unexpected, 'to NOT equal: ', unexpected);
                }
            }
        }
    };
};

var setTimeout = function(func, time) {
        $.sleep(time);
        func();
};
var breaker = {value: 0};
var setInterval = function(func, time, breaker) {
    if (!breaker || !breaker.value) return;
    while(breaker.value) {
        $.sleep(time);
        func();
    }
};

var watch = false;
var MONITOR_CTRL = false;
var OFF = false;
var ON = true;
var watchList = [];
var updateBreaker = function() {
    breaker.value = (watchList.length * MONITOR_CTRL);
};
var watchListContains = function(item) {
    var result = {
        exists: false,
        index : -1
    };

    for (var i = 0; i < watchList.length; i++) {
        if (result.exists) return result;
        result.index++;
        if (watchList[i].name === item.name) {
            result.exists = true;
        }
    }

    if (!result.exists) result.index = -1;

    return result;
};
var addToWatchList = function(item) {
    if (!watchListContains(item).exists) watchList.push({
        file        : item,
        name        : item.name,
        lastModified: item.modified,
        isUpdated   : function() {
            var now = this.file.modified.getTime();
            var last = this.lastModified.getTime();
            if (last !== now) return true;
            return false;
        }
    });
    updateBreaker();
};
var watchFile = function(path) {
    var file = File(path);
    if (!file.exists) {
        trace('[watchFile does not exist] (' + file + ')');
        return;
    }
    addToWatchList(file);
}
var watchFolder = function(path, _mask) {
    mask = _mask || "*";
    var folder = Folder(path);
    if (!folder.exists) {
        trace('[watchFolder does not exist] (' + folder + ')');
        return;
    }
    files = folder.getFiles(mask);
    for (var i in files) addToWatchList(files[i]);
}
var removeFromWatchList = function(item) {
    var index = watchListContains(item).index;
    if (index > -1) watchList.splice(index, 1);
    updateBreaker();
};
var evalFile = function(file) {
    file.open("r");
    var js = file.read();
    file.close();
    eval(js);
};
var runTest = function(test) {
    watch = false;
    evalFile(test);
    if (watch && MONITOR_CTRL) {
        addToWatchList(test);
        if (VERBOSE) trace('watching: ' + test.name);
    } else {
        removeFromWatchList(test);
    }
    updateBreaker();
    return;
};

var monitor;
var reset = function() {
    describes = [];
    its = [];
    passing = 0;
    pending = 0;
    failing = 0;
    watch = false;
    MONITOR_CTRL = false;
    VERBOSE = false;
    watchList = [];
    updateBreaker();
}
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
    trace('MONITOR_CTRL is ' + (MONITOR_CTRL ? '[ON] Watching for changes...' : '[OFF] Quiting'));
    if (!breaker.value) app.quit();
    else {
        if (VERBOSE) {
            var names = [];
            for (var i in watchList) names.push(watchList[i].name);
            trace('Watching:\n    ' + names.join('\n    ') + '\n[Set MONITOR_CTRL = OFF to stop]');
            monitor(watchList);
        } else {
            trace('Watching ' + watchList.length + ' files\n[Set MONITOR_CTRL = OFF to stop]');
            monitor(watchList);
        }
    }
};

var monitor = function(list) {
    setInterval(function() {
        var updated = false;
        for (var i in watchList) {
            if (watchList[i].isUpdated()) updated = true;
        }

        if (updated) {
            run();
        }
    }, 1000, breaker);
    app.quit();
}


run();
