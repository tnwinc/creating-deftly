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
}

//'w' = writing/overwriting; 'a' = appending; 'r' = reading;
module.Console = {
    log: function(string) {
        var time = new Date();
        var displayTime = ((time.getMonth()+1)+'/'+time.getDate()+'/'+time.getFullYear()+' ['+time.getHours()+':'+time.getMinutes()+':'+time.getSeconds()+']\n');
        var doc = getActiveDocument();
        var srcPath = doc.path;
        var activeDoc = doc.name + ': ';
        var stdout = File(srcPath + '/stdout.log');
        if (!stdout.exists) {
            stdout = new File(srcPath + '/stdout.log');
            stdout.open('w');
        } else {
            stdout.open('a');
        }
        stdout.writeln('\n' + activeDoc + displayTime + string);
    },
    
};
