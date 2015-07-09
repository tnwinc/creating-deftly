'use strict';
/*global describe it*/
var expect = require('chai').expect;
var date = require('../lib/date');

describe('date', function() {
    var test = date();
    it('should return a DD/MM/YYYY string', function() {
        expect(test).to.be.a('string');
        // console.log('    ' + test);
        expect(test.match(/[\/]/g)).to.have.length(2);
    });
});
