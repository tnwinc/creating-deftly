'use strict';
// var xdescribe = function(description, cb) {
//     writeToTestLogs('xDescribe ' + description + ' ~~');
//     writeToTestLogs('\n');
// };

// var describe = function(description, cb) {
//     writeToTestLogs('Describe ' + description + ' --');
//     describes.push(description);
//     var describeStartTime = time();
//     cb();
//     var describeFinalTime = time();
//     describes.pop();
//     writeToTestLogs('-- ' + describeFinalTime.diff(describeStartTime) + '\n');
// };

// var xit = function(description, cb) {
//     pending++;
//     writeToTestLogs('xIt ' + description + ' ~~');
// };

// var it = function(description, cb) {
//     its.push({
//         description: description,
//         tests      : []
//     });
//     var itStartTime = time();
//     cb();
//     var itFinalTime = time();
//     var index = its.length - 1;
//     var results = its[index].tests;
//     var passing = '✔ It ';
//     var tests = [];

//     for (var i = 0; i < results.length; i++) {
//         if (results[i].passed) {
//             tests.push(spaces(tabSize) + (i + 1) + ' ✔ ' + results[i].time.diff(itStartTime));
//         } else {
//             passing = '✘ It ';
//             tests.push(spaces(tabSize) + (i + 1) + ' ✘ ' + results[i].time.diff(itStartTime));
//             tests.push(spaces(tabSize * 2) + 'Expected    : [ ' + results[i].got + ' ]');
//             tests.push(spaces(tabSize * 2) + results[i].operator + '[ ' + results[i].expected + ' ]');
//         }
//     }

//     writeToTestLogs(passing + description + ': ' + itFinalTime.diff(itStartTime));
//     if (passing === '✘ It ' || results.length > 1) {
//         for (i = 0; i < tests.length; i++) {
//             writeToTestLogs(tests[i]);
//         }
//     }
//     its.pop();
// };
