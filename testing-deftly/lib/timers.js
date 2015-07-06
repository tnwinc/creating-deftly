var setTimeout = function(func, time) {
        $.sleep(time);
        func();
};

var setInterval = function(func, time, breaker) {
    if (!breaker || !breaker.value) return;
    while(breaker.value) {
        $.sleep(time);
        func();
    }
};