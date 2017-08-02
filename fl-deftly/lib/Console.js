'use strict';
if (!module) {
    var module = {};
}

var getActiveDocument = function() {
    if (fl.getDocumentDOM()){
        return fl.getDocumentDOM();
    } else {
        return {
            name: "",
            pathURI: fl.scriptURI.substr(0, fl.scriptURI.lastIndexOf("/")+1)
        };
    }
};

var writeToFile = function(fileName, string) {
    var time = new Date();
    var displayTime = ((time.getMonth()+1)+'/'+time.getDate()+'/'+time.getFullYear()+' ['+time.getHours()+':'+time.getMinutes()+':'+time.getSeconds()+']\n');
    var doc = getActiveDocument();
    var srcPath = doc.pathURI.substr(0, doc.pathURI.lastIndexOf("/")+1)
    var activeDoc = doc.name + ': ';
    var textToWrite = ('\n' + activeDoc + displayTime + string);
    var fileURI = (srcPath + fileName);

    FLfile.write(fileURI, textToWrite, 'append');
};


module.Console = {
    log  : function(string) {
        writeToFile("adobe.log", string);
    },
    error: function(string) {
        writeToFile("adobe.err", string);
    },
};
