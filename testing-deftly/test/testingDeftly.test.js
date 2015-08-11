'use strict';
/*global describe before it*/
var expect = require('chai').expect;

var fileMoc = function(name) {
    return {
        name  : name,
        exists: true
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

var TestingDeftly = require('../TestingDeftly')({}, fileMoc, folderMoc);

describe('testingDeftly', function() {
    it('should initialize with default values', function() {
            expect(TestingDeftly.testFileExtension).to.equal('spec');
            expect(TestingDeftly.projectDirectory).to.equal('~/Desktop');
            expect(TestingDeftly.verboseOutput).to.equal(false);
            expect(TestingDeftly.enableWatch).to.equal(false);
    });

    describe('run', function() {
        before(function() {
            TestingDeftly.run({
                testFileExtension: 'aispec',
                projectDirectory : '.',
                verboseOutput    : true,
                enableWatch      : true
            });
        });

        it('should clear logs and reset values', function() {
            expect(TestingDeftly.testFileExtension).to.equal('aispec');
            expect(TestingDeftly.projectDirectory).to.equal('.');
            expect(TestingDeftly.verboseOutput).to.equal(true);
            expect(TestingDeftly.enableWatch).to.equal(true);
        });

        it('should collect all the test files with the provided extension');

        it('should run each test file');

        it('should print the results');

        it('should hand off control to a watcher if enabled');
    });
});
