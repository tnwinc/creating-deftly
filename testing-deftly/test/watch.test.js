'use strict';
/*global describe before it*/
var expect = require('chai').expect;

var dateMoc = function(time) { return {getTime: function() { return time; }}; };
var fileMoc = function(name) {
    return {
        name    : name,
        exists  : true,
        modified: dateMoc(0)
    };
};
var folderMoc = function(nameFilesArray) {
    var name = nameFilesArray.shift();
    var files = nameFilesArray;
    return {
        name    : name,
        exists  : true,
        getFiles: function() { return files; }
    };
};
var loggerMoc = {text: ''};
loggerMoc.trace = function(string) {loggerMoc.text = string; };

var watcher = require('../lib/Watcher.js')(loggerMoc, fileMoc, folderMoc);

var testFile1 = fileMoc('testFile1');
var testFile2 = fileMoc('testFile2');

describe('watcher', function() {
    describe('adding and removing from watch list', function() {
        before(function() {
            watcher.watchList = [];
            watcher.watchFolder(['testFolder', testFile1, testFile2]);
        });

        it('should add files to the watch list without duplicates', function() {
            expect(watcher.watchList).to.have.length(2);
            watcher.watchFile('testFile1');
            expect(watcher.watchList).to.have.length(2);
        });

        it('should remove files from the watch list', function() {
            watcher.removeFromwatchList(testFile2);
            expect(watcher.watchList).to.have.length(1);
        });
    });
});
