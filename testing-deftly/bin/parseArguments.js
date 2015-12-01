#! /usr/bin/env node
'use strict';
var parseArguments = function(args, targetObject) {
	if (!targetObject) targetObject = {};

	var parseArgument = function(index) {
		var arg = args[index];
		var result = {};

		switch ( arg.substr(0, 2) ) {
			case '--':
				result.type = 'keyValue';
				result.name = arg.substr(2);
				result.value = args[index + 1];
				break;
			default:
				result.type = 'flag';
				result.name = arg;
				result.value = true;
		}

		result.name = result.name.replace(/-/g, '').toLowerCase();
		return result;
	};

	for (var i = 0; i < args.length; i++) {
		var argument = parseArgument(i);
		if (argument.type === 'keyValue') i++;
		targetObject[argument.name] = argument.value;
	}

	return targetObject;
};

module.exports = parseArguments;
