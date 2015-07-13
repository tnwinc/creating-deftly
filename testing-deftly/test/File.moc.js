'use strict';
var mocFile = function(path) {
    var fileObj = {};

    fileObj.name = path;
    fileObj.text = '';
    fileObj.readable = false;
    fileObj.writable = false;
    fileObj.append = false;
    fileObj.open = function(action) {
        switch (action) {
            case 'a':
                fileObj.writable = true;
                fileObj.append = true;
                break;
            case 'w':
                fileObj.writable = true;
                fileObj.append = false;
                break;
            case 'r':
                fileObj.readable = true;
                break;
            default:
                fileObj.readable = true;
                break;
        }
    };
    fileObj.writeln = function(string) {
        if (fileObj.writable) {
            if (fileObj.append) fileObj.text += string;
            else fileObj.text = string;
        }
    };
    fileObj.close = function() {
        fileObj.readable = false;
        fileObj.writable = false;
        fileObj.append = false;
    };

    return fileObj;
};

module.exports = mocFile;
