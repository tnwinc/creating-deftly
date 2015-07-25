'use strict';
/*global describe it*/
var expect = require('chai').expect;
var sleepMoc = function(delay) {
    var endTime = Date.now() + delay;
    var currentTime = null;
    do currentTime = Date.now(); while (currentTime < endTime);
};
var Delay = require('../lib/Delay')(sleepMoc);

describe('Delay', function() {
    describe('doAfter', function() {
        it('should properly delay', function() {
            var beforeTime = Date.now();
            var afterTime;
            Delay.doAfter(function() { afterTime = Date.now(); }, 10);
            expect(beforeTime + 10).to.equal(afterTime);
        });
    });

    describe('repeatAfter', function() {
        it('should repeat until 0', function() {
            var count = 3;
            var repeatFunc = function() {
                count--;
                if (count < 1) this.stop();
            };
            var repeater = Delay.repeatAfter(repeatFunc, 1);
            repeater.start();

            expect(count).to.equal(0);
        });
    });
});
