'use strict';
/*global describe before it*/
var expect = require('chai').expect;

var fileMoc = function(name, test) {
    return {
        name  : name,
        exists: true,
        open  : function() {},
        close : function() {},
        called: false,
        read  : function() { this.called = true; return test; }
    };
};
var testMoc = function(name, number, passing) {
    var testCode = ("describe('" + name + "', function() {" +
        "    it('should " + (passing ? 'pass' : 'fail') + "', function() {" +
        '        expect(' + number + ').to.be(' + (passing ? number : undefined) + ');' +
        '    });' +
        '});'
    );
    return testCode;
};
var testFile1 = fileMoc('aiTest1.aispec', testMoc('Ai Test1', 1, true));
var testFile2 = fileMoc('aiTest2.aispec', testMoc('Ai Test2', 2, false));
var testFile3 = fileMoc('flTest1.flspec', testMoc('Flash Test1', 3, false));
var folderMoc = function() {
    var files = [testFile1, testFile2, testFile3];
    return {
        getFiles: function(pattern) {
            return files.filter(function(f) {return f.name.match(pattern.substr(1)); });
        }
    };
};

var TestingDeftly = require('../TestingDeftly')({Folder: folderMoc, File: fileMoc, Options: {}});

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

        it('should run each test file', function() {
            expect(TestingDeftly.testFiles[0].called).to.equal(true);
        });

        it('should print the results');

        it('should hand off control to a watcher if enabled');
    });
});
