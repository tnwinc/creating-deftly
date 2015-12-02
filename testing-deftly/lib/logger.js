'use strict';

var Logger = function(path, name, tabSize, lineFeed, _File) {
    try {
        _File = File || _File; // eslint-disable-line no-undef
    } catch(e) {
        //do nothing
    }

    var logObj = {};

    var setPath = function(path) {
        if (path.substr(path.length - 1, 1) !== '/') path += '/';
        logObj.path = path;
        return logObj;
    };
    logObj.setPath = setPath;
    setPath(path || '~/Dekstop/');

    var setName = function(name) {
        if (name.substr(name.length - 1, 1) === '/') name = name.substr(0, name.length - 1);
        if (name.substr(0, 1) === '/') name = name.substr(1, name.length);
        logObj.name = name;
        return logObj;
    };
    logObj.setName = setName;
    setName(name || 'adobe.test');

    var setLineFeed = function(feedType) {
        logObj.lineFeed = feedType;
        return logObj;
    };
    logObj.setLineFeed = setLineFeed;
    setLineFeed(lineFeed || 'Unix'); //"Windows" "Macintosh"

    var setFile = function(path, name) {
        setPath(path);
        setName(name);
        var filePath = logObj.path + logObj.name;
        var file = new _File(filePath);
        // if (!file.exists) file = new File(filePath);

        file.encoding = 'UTF-8';
        file.lineFeed = logObj.lineFeed;

        logObj.file = file;
        return logObj;
    };
    logObj.setFile = setFile;
    setFile(path, name);

    var setTabSize = function(size) {
        logObj.tabSize = size || 4;
        return logObj;
    };
    logObj.setTabSize = setTabSize;
    setTabSize(tabSize || 4);

    var tab = function(number) {
        var spaces = '';
        while (number > 0) {
            spaces += ' ';
            number--;
        }
        return spaces;
    };
    logObj.tab = tab;

    var writeln = function(string, tabCount, action) {
        if (string === undefined || string === null) throw ('log Object: writeLn: ERROR: Must provide a string value');
        tabCount = tabCount || 0;
        action = action || 'a'; //'w'
        logObj.file.open(action);
        logObj.file.writeln(tab(tabCount * logObj.tabSize) + string);
        logObj.file.close();
        return logObj;
    };
    logObj.writeLn = writeln;

    var trace = function(string) {
        writeln('testingDeftly-- ' + string);
        return logObj;
    };
    logObj.trace = trace;

    var clear = function() {
        writeln('', 0, 'w');
        return logObj;
    };
    logObj.clear = clear;

    return logObj;
};

module.exports = Logger;
