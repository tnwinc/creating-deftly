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

var Watcher = require('../lib/Watcher.js')(loggerMoc, fileMoc, folderMoc);

var testFile1 = fileMoc('testFile1');
var testFile2 = fileMoc('testFile2');

describe('Watcher', function() {
    describe('adding and removing from watch list', function() {
        before(function() {
            Watcher.watchList = [];
            Watcher.watchFolder(['testFolder', testFile1, testFile2]);
        });

        it('should add files to the watch list without duplicates', function() {
            expect(Watcher.watchList).to.have.length(2);
            Watcher.watchFile('testFile1');
            expect(Watcher.watchList).to.have.length(2);
        });

        it('should remove files from the watch list', function() {
            Watcher.removeFromwatchList(testFile2);
            expect(Watcher.watchList).to.have.length(1);
        });
    });

    describe('watch a file and execute a callback when it has been modified', function() {
        before(function() {
            Watcher.watchList = [];
            Watcher.watchFolder(['testFolder', testFile1, testFile2]);
            Watcher.enabled = true;
        });

        it('should execute the callback each time the file is updated', function() {
            var count = 0;
            var callOrder = [];
            testFile1.modified = dateMoc(1);
            testFile2.modified = dateMoc(1);
            Watcher.start(function(f) {
                count++;
                callOrder.push(f.name);
                if (count === 2) Watcher.enabled = false;
            }, 1);
            expect(count).to.equal(2);
            expect(callOrder.toString()).to.equal('testFile1,testFile2');
        });
    });
});
