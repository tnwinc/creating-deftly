var testLogsPath = workingDirectory + '/adobe.test';
var testLogs = File(testLogsPath);
if (!testLogs.exists) testLogs = new File(testLogsPath);

testLogs.encoding = "UTF-8";
testLogs.lineFeed = "Unix";
// txtFile.lineFeed = "Windows";
// txtFile.lineFeed = "Macintosh";
var clearTestLogs = function() {
    testLogs.open('w');
    testLogs.writeln('');
    testLogs.close();
};

var spaces = function(number) {
    var spaces = '';
    while(number > 0) {
        spaces += ' ';
        number --;
    }
    return spaces;
};

var writeToTestLogs = function(string) {
    testLogs.open('a');
    testLogs.writeln(spaces(describes.length * tabSize) + string);
    testLogs.close();
};

var trace = function(string) {
    writeToTestLogs('testingDeftly-- ' + string);
};