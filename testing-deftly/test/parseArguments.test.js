'use strict';
/*global describe it*/

var expect = require('chai').expect;
var parseArguments = require('../bin/parseArguments');

describe('parseArguments', function() {
	describe('flag options', function() {
		it('should set the property on the object to true', function() {
			var test = parseArguments(['-Flag']);
			expect(test.flag).to.equal(true);
		});
		it('should strip out single - characters from the name', function() {
			var test = parseArguments(['-flag-With-Dash']);
			expect(test.flagwithdash).to.equal(true);
		});
		it('should convert names to lowercase', function() {
			var test = parseArguments(['IGNOREcase']);
			expect(test.ignorecase).to.equal(true);
		});
	});
});
