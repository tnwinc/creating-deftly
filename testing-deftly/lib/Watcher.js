'use strict';

var Watcher = function() {
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
                lastModified: item.modified,
                isUpdated   : function() {
                    var now = this.file.modified.getTime();
                    var last = this.lastModified.getTime();
                    if (last !== now) return true;
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

};

// var breaker = {value: 0};
// var updateBreaker = function() {
//     breaker.value = (watchList.length * MONITOR_CTRL);
// };
//
// var watchFile = function(path) {
//     var file = new File(path);
//     if (!file.exists) {
//         trace('[watchFile does not exist] (' + file + ')');
//         return;
//     }
//     addToWatchList(file);
// };
//
// var watchFolder = function(path, _mask) {
//     mask = _mask || '*';
//     var folder = new Folder(path);
//     if (!folder.exists) {
//         trace('[watchFolder does not exist] (' + folder + ')');
//         return;
//     }
//     files = folder.getFiles(mask);
//     for (var i in files) addToWatchList(files[i]);
// };
//
// var monitor = function(list) {
//     setInterval(function() {
//         var updated = false;
//         for (var i in watchList) {
//             if (watchList[i].isUpdated()) updated = true;
//         }
//
//         if (updated) run();
//     }, 1000, breaker);
//     app.quit();
// };
module.exports = Watcher;
