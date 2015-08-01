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
// var folderMoc = function(name, files) {
//     return {
//         name    : name,
//         exists  : true,
//         getFiles: function() { return files; }
//     };
// };
var loggerMoc = {text: ''};
loggerMoc.trace = function(string) {loggerMoc.text = string; };

var watcher = require('../lib/Watcher.js')(loggerMoc, fileMoc);

// var testFile1 = fileMoc('testFile1');
var testFile2 = fileMoc('testFile2');
// var testFolder = folderMoc('testFolder', [testFile1, testFile2]);

describe('watcher', function() {
    describe('adding and removing from watch list', function() {
        before(function() {
            watcher.watchList = [];
            watcher.watchFile('testFile1');
            watcher.watchFile('testFile2');
            // watcher.watchFolder(testFolder);
            watcher.removeFromwatchList(testFile2);
        });
        it('should add/remove files to the watch list without duplicates', function() {
            expect(watcher.watchList).to.have.length(1);
        });
    });
});
