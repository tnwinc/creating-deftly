#! /usr/bin/env node
'use strict';
var help = require('./help.js');
var parseArgs = require('./parseArguments');
var execAsyncCMD = require('./execAsyncCMD');
// var tdeftlyAppPath = process.argv[1];
var userArgs = process.argv.slice(2);
var test = require('/Users/sjpeaster/Projects/creating-deftly/ai-deftly/tdeftly.opts.json');
console.log(test);
console.log('-------------------');
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

	parseArgs(userArgs, tdeftly);
	if (tdeftly.help || tdeftly.h) help.show();
	execAsyncCMD('cat tdeftly.opts').then(function( userOptsJSON ) {

		console.log(userOptsJSON);
		var userOptions = JSON.parse(userOptsJSON);
		console.log(userOptions);

		/* TODO look for and process opts file before parsing user args below
			//  Look for a tDeftly.opts json file - refer to mocha.opts
			//  update tdeftly configuration with options supplied in folder
		*/
	})
	.onRejected(function() {
		console.log('No tdeftly.opts file found, continuing with default options');
	});

})
.onRejected(function(err) {
	console.log( '\nERROR: Failed to find path to current directory using pwd\n' + err );
})
.finally(function() {
	// console.log(' - Watching: ' + tdeftly.watch);
	// console.log(' - Verbose : ' + tdeftly.verbose);
});
