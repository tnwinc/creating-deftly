'use strict';

var Delay = require('./Delay');

var Watcher = function(logger, _File, _Folder) {
    try {
        _File = File || _File; // eslint-disable-line no-undef
        _Folder = Folder || _Folder; // eslint-disable-line no-undef
    } catch(e) {
        //do nothing
    }
    var trace = logger.trace;
    var watchObj = {};

    watchObj.enabled = false;
    watchObj.watchList = [];

    var watchListContains = function(item) {
        var list = watchObj.watchList;
        var result = {
            exists: false,
            index : -1
        };

        for (var i = 0; i < list.length; i++) {
            // if (result.exists) return result;
            result.index++;
            if (list[i].name === item.name) {
                result.exists = true;
                break;
            }
        }

        if (!result.exists) result.index = -1;

        return result;
    };

    var addToWatchList = function(item) {
        if (!watchListContains(item).exists) {
            watchObj.watchList.push({
                file        : item,
                name        : item.name,
                lastModified: item.modified.getTime(),
                isUpdated   : function() {
                    var now = this.file.modified.getTime();
                    var last = this.lastModified;
                    if (last !== now) {
                        this.lastModified = now;
                        return true;
                    }
                    return false;
                }
            });
            // updateBreaker();
        }
    };
    watchObj.addToWatchList = addToWatchList;

    var removeFromwatchList = function(item) {
        var index = watchListContains(item).index;
        if (index > -1) {
            watchObj.watchList.splice(index, 1);
            // updateBreaker();
        }
    };
    watchObj.removeFromwatchList = removeFromwatchList;

    var watchFile = function(path) {
        var file = new _File(path);
        if (!file.exists) {
            trace('[watchFile does not exist] (' + file + ')');
            return;
        }
        addToWatchList(file);
    };
    watchObj.watchFile = watchFile;

    var watchFolder = function(path, mask) {
        mask = mask || '*';
        var folder = new _Folder(path);
        if (!folder.exists) {
            trace('[watchFolder does not exist] (' + folder + ')');
            return;
        }
        var files = folder.getFiles(mask);
        for (var i in files) addToWatchList(files[i]);
    };
    watchObj.watchFolder = watchFolder;


    var start = function(cb, wait) {
        wait = wait || 1000; //1 seconds

        if (!watchObj.enabled) return;
        if (!cb) return;

        var repeatFunc = function() {
            if (!watchObj.enabled) this.stop();
            for (var i in watchObj.watchList) {
                if (!watchObj.enabled) break;
                var file = watchObj.watchList[i];
                if (file.isUpdated()) {
                    cb(file);
                }
            }
        };
        var repeater = Delay.repeatAfter(repeatFunc, wait);
        repeater.start();

        //app.quit(); FIXME <--The start function should only run callbacks on updates
    };
    watchObj.start = start;

    return watchObj;
};


module.exports = Watcher;
