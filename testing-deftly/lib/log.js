'use strict';
/*global File*/
var log = function(path, name, tabSize, lineFeed) {
    var logObj = {};

    logObj.path = path || '~/Dekstop/';
    logObj.name = name || 'adobe.test';

    logObj.lineFeed = lineFeed || 'Unix'; //"Windows" "Macintosh"
    logObj.setLineFeed = function(feedType) { logObj.lineFeed = feedType; return logObj; };

    var setFile = function(path, name) {
        var filePath = path + name;
        var file = new File(filePath);
        // if (!file.exists) file = new File(filePath);

        file.encoding = 'UTF-8';
        file.lineFeed = logObj.lineFeed;

        logObj.file = file;
        return logObj;
    };
    logObj.setFile = setFile;
    setFile(path, name);

    logObj.tabSize = tabSize || 4;
    logObj.setTabSize = function(size) { logObj.tabSize = size || 4; return logObj; };
    var tab = function(number) {
        var spaces = '';
        while (number > 0) {
            spaces += ' ';
            number--;
        }
        return spaces;
    };
    logObj.tab = tab;

    var writeLn = function(string, tabCount, action) {
        if (string === undefined || string === null) throw ('log Object: writeLn: ERROR: Must provide a string value');
        tabCount = tabCount || 0;
        action = action || 'a'; //'w'
        logObj.file.open(action);
        logObj.file.writeln(tab(tabCount * logObj.tabSize) + string);
        logObj.file.close();
    };
    logObj.writeLn = writeLn;

    var trace = function(string) {
        writeLn('testingDeftly-- ' + string);
    };
    logObj.trace = trace;

    var clear = function() {
        logObj.writeln('', 0, 'w');
        return logObj;
    };
    logObj.clear = clear;

    return logObj;
};

module.exports = log;
