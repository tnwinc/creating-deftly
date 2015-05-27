#target Illustrator

//
//    Determin current working directory--
//
var srcPath = undefined;
//var winPathCC   = "/c/Program Files/Adobe/Adobe lllustratorCC/Startup Scripts/creatingDeftly/";
var winPath2014 = "/c/Program Files/Adobe/Adobe lllustratorCC/Startup Scripts/creatingDeftly/";
//var osxPathCC   = "/Applications/Adobe lllustrator CC 2014/Startup Scripts/creatingDeftly/";
var osxPath2014 = "/Applications/Adobe Illustrator CC 2014/Startup Scripts/creatingDeftly/";

var fileExists = function(filePath){
    return (new File(filePath).exists)
};

//if (fileExists(winPathCC)) srcPath = winPathCC;
if (fileExists(winPath2014)) srcPath = winPath2014;
//if (fileExists(osxPathCC)) srcPath = osxPathCC;
if (fileExists(osxPath2014)) srcPath = osxPath2014;

if (srcPath == undefined) throw("Unknown OS or unsupported version of Adobe Illustrator");
//  --END

//
//    Require logic--
//
var module = {};
function require(fileName, alias){
    var reqFile = new File(osxPath2014 + fileName);
    //alert(reqFile.exists)
    reqFile.open("r");
    var js = reqFile.read();
    eval(js);
    return module[alias];
}
//  --END

//
//    Default Dependencies
//
var Ensure = require("Ensure.js", "Ensure");
var Obj    = require("Obj.js", "Obj");
var JSON   = require("json2.js", "JSON");
var Ai     = require("Ai.js", "Ai");