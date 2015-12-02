#! /usr/bin/env node
'use strict';
var execAsyncCMD = require('./execAsyncCMD');
var help = require('./help.js');
var parseArgs = require('./parseArguments');
var userArgs = process.argv.slice(2); // eslint-disable-line no-unused-vars
// SJ: Above we use slice(2) because the first argument is always node,
//     and the second is the path to the file that has been executed.

var tdeftly = {
	help             : false,
	watch            : false,
	verbose          : false,
	testFileExtension: 'spec',
	projectDirectory : '~/Desktop',  // TODO Get PWD at the beginning of this file
	time             : require('../lib/Time'),
	date             : require('../lib/date'),
	logger           : require('../lib/logger'),
	brandching       : require('../lib/Branching'),
	assertions       : require('../lib/Assertions')
};
// SJ: Above is the initial config with default options
//     Some of these can change from user args in the next line,
//     Others can change from a tdeftly.opts file
// TODO look for and process opts file before parsing user args below
parseArgs(userArgs, tdeftly);


if (tdeftly.help || tdeftly.h) help.show(); // eslint-disable-line curly
else {
	execAsyncCMD('pwd').then(function(dirPath) {
		console.log(dirPath);
	}).onError(function(err) {
		console.log(err);
	}).finally(function() {
		console.log(' - Watching: ' + tdeftly.watch);
	});
}
	// 		// Look for a testingDeftly.opts json file - refer to mocha.opts
	// 		// update tdeftly configuration with options supplied in folder
