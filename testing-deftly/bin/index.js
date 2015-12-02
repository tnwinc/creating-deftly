#! /usr/bin/env node
'use strict';
var execAsyncCMD = require('./execAsyncCMD');
var help = require('./help.js');
var parseArgs = require('./parseArguments');
var userArgs = process.argv.slice(2);
/* SJ: Above we use slice(2) because the first argument is always node,
   //  and the second is the path to the this node app (/usr/local/bin/tdeftly).
   //  These arguments will be processed last, after any tdeftly.opts files
*/

var tdeftly = {
	help             : false,
	watch            : false,
	verbose          : false,
	testFileExtension: 'spec',
	projectDirectory : '~/Desktop',
	time             : require('../lib/Time'),
	date             : require('../lib/date'),
	logger           : require('../lib/logger'),
	brandching       : require('../lib/Branching'),
	assertions       : require('../lib/Assertions')
};
/* SJ: Above is the initial config with default options
   //  Some of these can change from user args in the next line,
   //  Others can change from a tdeftly.opts file
*/


execAsyncCMD('pwd').then(function(pwd) {
	tdeftly.projectDirectory = pwd;
	console.log(pwd);
	// TODO look for and process opts file before parsing user args below
	// 		Look for a testingDeftly.opts json file - refer to mocha.opts
	// 		update tdeftly configuration with options supplied in folder
	parseArgs(userArgs, tdeftly);
	if (tdeftly.help || tdeftly.h) help.show();

}).onError(function(err) {
	console.log(err);
}).finally(function() {
	console.log(' - Watching: ' + tdeftly.watch);
	console.log(' - Verbose : ' + tdeftly.verbose);
});
