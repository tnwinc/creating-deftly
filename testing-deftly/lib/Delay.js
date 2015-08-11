'use strict';

if (!$) { // eslint-disable-line no-use-before-define
    var $ = {};
    $.sleep = function(delay) {
        var endTime = Date.now() + delay;
        var currentTime = null;
        do currentTime = Date.now(); while (currentTime < endTime);
    };
}

var Delay = function() {
    var sleep = $.sleep;

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
}();

module.exports = Delay;
