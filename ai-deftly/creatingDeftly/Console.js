'use strict';
if (!module) {
    var module = {};
}

var getActiveDocument = function() {
    if (app.documents.length > 0){
        return app.activeDocument;
    } else {
        return {
            name: "",
            path: "~/Desktop/"
        };
    }
};

var writeToFile = function(fileName, string) {
    //'w' = writing/overwriting; 'a' = appending; 'r' = reading;
    var time = new Date();
    var displayTime = ((time.getMonth()+1)+'/'+time.getDate()+'/'+time.getFullYear()+' ['+time.getHours()+':'+time.getMinutes()+':'+time.getSeconds()+']\n');
    var doc = getActiveDocument();
    var srcPath = doc.path;
    var activeDoc = doc.name + ': ';
    var filePath = (srcPath + '/' + fileName);
    var file = File(filePath);
    if (!file.exists) {
        file = new File(filePath);
        file.open('w');
    } else {
        file.open('a');
    }
    file.writeln('\n' + activeDoc + displayTime + string + '\n--' + srcPath);
};

var transformErrorObject = function(e) {
    var number      = e.number;      //Illustrator's error code for this error
    var fileName    = e.fileName;    //the full path to the problem file
    var line        = e.line;        //Line number where error occured
    var source      = e.source;      //this is the entire source script
    var start       = e.start;       //The line relative to the error line that the problem started
    var end         = e.end;         //same as above but reversed
    var message     = e.message;     //same as description
    var name        = e.name;        //just error
    var description = e.description; //same as message
    var _ = ' ';
    var linesOfCode = source.split("\n");
    if (start == 0) start = -1;
    if (end == 0) end = -1;

    return (name + _ + number +
        "\n" + fileName + _ +
        "\n" + "   " + (line + start) + _ + linesOfCode[line + start-1] +
        "\n" + " ! " + (line) + _ + linesOfCode[line-1] + " //" + message +
        "\n" + "   " + (line - end) + _ + linesOfCode[line - end-1]); 
}


this.module.Console = {
    log  : function(string) {
        writeToFile("adobe.log", string);
    },
    error: function(string) {
        if (string.message) string = transformErrorObject(string)
        writeToFile("adobe.err", string);
        app.quit();
    },
};
