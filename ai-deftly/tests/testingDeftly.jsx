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
var time = function() {
    var time = new Date();
    return ('['+time.getHours()+':'+time.getMinutes()+':'+time.getSeconds()+']');
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
testLogs.writeln('Running Illustrator Tests: ' + date() + spaces(1) + time() + '\n');
testLogs.close();

var describes = [];
var its = [];
var writeToTestLogs = function(string) {
    testLogs.open('a');
    testLogs.writeln(spaces(describes.length * tabSize) + string);
    testLogs.close();
};
var trace = function(string) {
    writeToTestLogs(spaces(tabSize) + '--' + string);
};

var xdescribe = function() {};
var describe = function(description, cb) {
    writeToTestLogs(description + ' --');
    describes.push(description);
    cb();
    describes.pop();
    writeToTestLogs('--\n');
};

var xit = function() {};
var it = function(description, cb) {
    writeToTestLogs('It ' + description + ': ' + time());
    its.push(description);
    cb();
    its.pop();
};

var expect = function(test) {
    var logResult = function(result, operator, got) {
        if (result) writeToTestLogs(spaces(tabSize) + '✔ PASS');
        else {
            writeToTestLogs(spaces(tabSize) + 'FAIL ' + time());
            writeToTestLogs(spaces(tabSize) + 'Expected    : [' + test + ']');
            writeToTestLogs(spaces(tabSize) + operator + '[' + got + ']');
        }
    };

    return {
        to: {
            be: function(expected) {
                logResult(test === expected, 'to be       : ', expected);
            },
            equal: function(expected) {
                logResult(test == expected, 'to equal    : ', expected);
            },
            not: {
                be: function(unexpected) {
                        logResult(test !== unexpected, 'to NOT be   : ', unexpected);
                },
                equal: function(unexpected) {
                        logResult(test != unexpected, 'to NOT equal: ', unexpected);
                }
            }
        }
    };
};

#include 'Str_test.jsx'

app.quit();