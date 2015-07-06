var WATCH = false;
var watchList = [];

var breaker = {value: 0};
var updateBreaker = function() {
    breaker.value = (watchList.length * MONITOR_CTRL);
};

var watchListContains = function(item) {
    var result = {
        exists: false,
        index : -1
    };

    for (var i = 0; i < watchList.length; i++) {
        if (result.exists) return result;
        result.index++;
        if (watchList[i].name === item.name) {
            result.exists = true;
        }
    }

    if (!result.exists) result.index = -1;

    return result;
};

var removeFromwatchList = function(item) {
    var index = watchListContains(item).index;
    if (index > -1) watchList.splice(index, 1);
    updateBreaker();
};

var addToWatchList = function(item) {
    if (!watchListContains(item).exists) watchList.push({
        file        : item,
        name        : item.name,
        lastModified: item.modified,
        isUpdated   : function() {
            var now = this.file.modified.getTime();
            var last = this.lastModified.getTime();
            if (last !== now) return true;
            return false;
        }
    });
    updateBreaker();
};

var watchFile = function(path) {
    var file = File(path);
    if (!file.exists) {
        trace('[watchFile does not exist] (' + file + ')');
        return;
    }
    addToWatchList(file);
}

var watchFolder = function(path, _mask) {
    mask = _mask || "*";
    var folder = Folder(path);
    if (!folder.exists) {
        trace('[watchFolder does not exist] (' + folder + ')');
        return;
    }
    files = folder.getFiles(mask);
    for (var i in files) addToWatchList(files[i]);
}

var monitor = function(list) {
    setInterval(function() {
        var updated = false;
        for (var i in watchList) {
            if (watchList[i].isUpdated()) updated = true;
        }

        if (updated) {
            run();
        }
    }, 1000, breaker);
    app.quit();
}