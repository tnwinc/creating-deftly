#! /usr/bin/env node
'use strict';
var exec = require('child_process').exec;
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
	exec('pwd', function(err, stdout, stderr) { //child_process is async
		if (err || stderr) console.log(err || stderr);
		else {
			var pwd = stdout;
			console.log('Running Tests in ' + pwd);
			if (tdeftly.watch) console.log('Watching...');
			// Look for a testingDeftly.opts json file - refer to mocha.opts
			// update tdeftly configuration with options supplied in folder
		}
	});
}
