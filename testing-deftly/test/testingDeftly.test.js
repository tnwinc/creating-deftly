'use strict';
/*global describe before it*/
var expect = require('chai').expect;

var fileMoc = function(name) {
    return {
        name  : name,
        exists: true
    };
};
var testFile1 = fileMoc('aiTest1.aispec');
var testFile2 = fileMoc('aiTest2.aispec');
var testFile3 = fileMoc('flTest1.flspec');
var folderMoc = function() {
    var files = [testFile1, testFile2, testFile3];
    return {
        getFiles: function(pattern) {
            return files.filter(function(f) {return f.name.match(pattern.substr(1)); });
        }
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

        it('should collect all the test files with the provided extension', function() {
            expect(TestingDeftly.testFiles.length).to.equal(2);
        });

        it('should run each test file');

        it('should print the results');

        it('should hand off control to a watcher if enabled');
    });
});
