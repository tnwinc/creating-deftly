'use strict';
var time = function(date) {
    var time = date || new Date();
    var _hour = time.getHours();
    var _minute = time.getMinutes();
    var _second = time.getSeconds();
    var _millisecond = time.getMilliseconds();
    var _inMilliseconds = Date.now();
    var result = {
        hour          : _hour,
        minute        : _minute,
        second        : _second,
        millisecond   : _millisecond,
        standard      : ('(' + _hour + ':' + _minute + ':' + _second + ')'),
        full          : ('(' + _hour + ':' + _minute + ':' + _second + ':' + _millisecond + ')'),
        inMilliseconds: _inMilliseconds,
        diff          : function(oldTime, newTime) {
            newTime = newTime || _inMilliseconds;
            var timeDiff = newTime - oldTime.inMilliseconds;
            if (timeDiff < 0) return ('(-time, reverse your evaluation)');

            var hours = (1000 * 60 * 60);
            var minutes = (1000 * 60);
            var seconds = (1000);

            var format = function(value, part) {
                if (part === 'm' && value === 0) return '0m';
                if (value > 0) return (value + part);
                return '';
            };

            var hoursDiff = format(Math.floor(timeDiff / hours), 'h');
            var modHours = timeDiff % hours;
            var minutesDiff = format(Math.floor(modHours / minutes), 'min');
            var modMinutes = modHours % minutes;
            var secondsDiff = format(Math.floor(modMinutes / seconds), 's');
            var millisecondsDiff = format(modMinutes % seconds, 'm');

            return '(+' + hoursDiff + minutesDiff + secondsDiff + millisecondsDiff + ')';
        }
    };
    return result;
};

module.exports = time;
