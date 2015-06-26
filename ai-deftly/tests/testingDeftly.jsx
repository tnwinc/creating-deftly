#target illustrator

var moduleNotFound = function(name){
    alert("Failed to load module: " + name);
    return false;
};

var testInstall = function() {
    if (!Console) return moduleNotFound("Console");
    if (!Ensure) return moduleNotFound("Ensure");
    if (!Obj) return moduleNotFound("Obj");
    if (!JSON) return moduleNotFound("JSON");
    if (!Ai) return moduleNotFound("Ai");
    if (!Str) return moduleNotFound("Str");
    return true;
};

if (!testInstall()) {
    app.quit();
}

var workingDirectory = File($.fileName).parent; //Make a file module an alias this to pwd
var lastTime = undefined;
var time = function() {
    var time = new Date();
    var _hour        = time.getHours();
    var _minute      = time.getMinutes();
    var _second      = time.getSeconds();
    var _millisecond = time.getMilliseconds();
    result = {
        hour       : _hour,
        minute     : _minute,
        second     : _second,
        millisecond: _millisecond,
        standard   : ('('+_hour+':'+_minute+':'+_second+')'),
        full       : ('('+_hour+':'+_minute+':'+_second+':'+_millisecond+')')
    };
    lastTime = result;
    return result;
}
lastTime = time();
var timeDiff = function(timeToCompare) {
    var oldTime = timeToCompare || lastTime;
    var newTime = time();
    lastTime = newTime;
    alert(oldTime.millisecond + '\n' + lastTime.millisecond);
    var hourDiff = oldTime.hour        - newTime.hour;
    var minDiff  = oldTime.minute      - newTime.minute;
    var secDiff  = oldTime.second      - newTime.second;
    var milDiff  = oldTime.millisecond - newTime.millisecond;
    if (hourDiff > 0) {hourDiff += 'hr'}else{hourDiff = ''};
    if (minDiff  > 0) {minDiff  += 'min'}else{minDiff = ''};
    if (secDiff  > 0) {secDiff  += 's'}else{secDiff = ''};
    if (milDiff  > 0) {milDiff  += 'm'}else{milDiff = '0m'};
    return "(+"+hourDiff+minDiff+secDiff+milDiff+")";
};
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
}
var tabSize = 4;

var testLogsPath = workingDirectory + '/adobe.test';
var testLogs = File(testLogsPath);
if (!testLogs.exists) testLogs = new File(testLogsPath);

testLogs.encoding = "UTF-8";
testLogs.lineFeed = "Unix";
// txtFile.lineFeed = "Windows";
// txtFile.lineFeed = "Macintosh";
testLogs.open('w');
testLogs.writeln('');
testLogs.close();

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
var trace = function(string) {
    writeToTestLogs('testingDeftly-- ' + string);
};
var printResults = function() {
    writeToTestLogs(spaces(tabSize) + passing + ' passing');
    if (pending) writeToTestLogs(spaces(tabSize) + pending + ' pending');
    if (failing) writeToTestLogs(spaces(tabSize) + failing + ' failing');
}

var xdescribe = function(description, cb) {
    writeToTestLogs('xdescribe ' + description + ' ~~');
    writeToTestLogs('\n');
};
var describe = function(description, cb) {
    writeToTestLogs('Describe ' + description + ' --');
    describes.push(description);
    cb();
    describes.pop();
    writeToTestLogs('--\n');
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
    time();
    cb();
    var index = its.length-1;
    var results = its[index].tests;
    var passing = '✔ It ';
    var tests = [];

    for (i=0; i<results.length; i++) {
        if (results[i].passed) {
            tests.push(spaces(tabSize) + (i+1) + ' ✔ ' + timeDiff());
        } else {
            passing = '✘ It ';
            tests.push(spaces(tabSize) + (i+1) + ' ✘ ' + timeDiff());
            tests.push(spaces(tabSize*2) + 'Expected    : [ ' + results[i].got + ' ]');
            tests.push(spaces(tabSize*2) + results[i].operator + '[ ' +  results[i].expected + ' ]');
        }
    }
    
    writeToTestLogs(passing + description + ': ' + timeDiff());
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

trace('Running Illustrator Tests: ' + date() + spaces(1) + time().standard + '\n');

#include 'Str_test.jsx'

trace('finished running tests ' + time().standard);
printResults();
