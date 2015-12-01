#! /usr/bin/env node
'use strict';
var version = require('../package.json').version;

var help = {
	text: 'TESTING DEFTLY HELP' +
		'\n  v' + version +
		'\n  Testing Deftly is a testing fraemwork for automating' +
		'\n  manual tests in Adobe applications with a unified' +
		'\n  API and familiar syntax to users of mocha and chai.' +
		'\n' +
		'\n  OPTIONS:' +
		'\n    watch' +
		'\n     - Runs tests and then watches files for chainges' +
		'\n    help' +
		'\n     - Show this message that you\'re reading right now' +
		'\n',
	show: function() {
		console.log(this.text);
	}
};

module.exports = help;
