#! /usr/bin/env node
'use strict';
var exec = require('child_process').exec;
var help = require('./help.js');
var parseArgs = require('./parseArguments');
var userArgs = process.argv.slice(2); // eslint-disable-line no-unused-vars
// SJ: Above we use slice(2) because the first argument is always node,
//     and the second is the path to the file that has been executed.

// SJ: Below is the initial config with default options
//     Some of these can change from user args,
//     Others can change from  a tdeftly.opts file
var tdeftly = {
	help : false,
	watch: false,
	time : require('../lib/Time')
};


parseArgs(userArgs, tdeftly);



if (tdeftly.help || tdeftly.h) help.show();

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
