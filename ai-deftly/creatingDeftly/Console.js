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
    file.writeln('\n' + activeDoc + displayTime + string);
};

//'w' = writing/overwriting; 'a' = appending; 'r' = reading;
module.Console = {
    log  : function(string) {
        writeToFile("stdout.log", string);
    },
    error: function(string) {
        writeToFile("stderr.log", string);
        app.quit();
    },
};
