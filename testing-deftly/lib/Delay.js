'use strict';
/*global $*/

var Delay = function(sleepFunc) {
    var sleep = sleepFunc || $.sleep;

    var delayObj = {};

    var doAfter = function(func, time) {
            sleep(time);
            func();
    };
    delayObj.doAfter = doAfter;

    var repeatAfter = function(func, time) {
        var repeatObj = {};

        repeatObj.func = func;

        repeatObj.waitTime = time;

        var running = false;
        var run = function() {
            while (running) {
                sleep(repeatObj.waitTime);
                repeatObj.func();
            }
        };

        var start = function() { running = true; run(); };
        repeatObj.start = start;

        var stop = function() { running = false; return; };
        repeatObj.stop = stop;

        return repeatObj;
    };
    delayObj.repeatAfter = repeatAfter;

    return delayObj;
};

module.exports = Delay;
