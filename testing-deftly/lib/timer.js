'use strict';
/*global $*/

var timer = function() {
    var timerObj = {};

    var setTimeout = function(func, time) {
            $.sleep(time);
            func();
    };
    timerObj.setTimeout = setTimeout;

    var setInterval = function(func, time, breaker) {
        if (!breaker || !breaker.value) return;
        while (breaker.value) {
            $.sleep(time);
            func();
        }
    };
    timerObj.setInterval = setInterval;
};

module.exports = timer;
